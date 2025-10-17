import Affect from '#models/affect'
import Comment from '#models/comment'
import User from '#models/user'
import { affectCommentValidator } from '#validators/affect_comment'
import { affectCreateValidator } from '#validators/affect_create'
import { affectEditValidator } from '#validators/affect_edit'
import type { HttpContext } from '@adonisjs/core/http'

export default class AffectController {
	async catalog({ view, auth }: HttpContext) {
		const authUser = auth.user

		const affects = (await Affect.query().where('delisted', false)).reverse()

		let listers: Map<number, User | null> = new Map()
		for (const affect of affects)
			listers.set(affect.lister, await User.find(affect.lister))

		await authUser?.load('cart')
		await authUser?.load('inventory')
		return view.render('pages/affects', { affects, listers, authUser })
	}

	/**
	 * Display form to create a new record
	 */
	async create({ view, auth, response }: HttpContext) {
		const authUser = auth.user

		if (!authUser) {
			response.status(403).redirect().toRoute('auth.login')
			return
		}

		await authUser?.load('cart')
		return view.render('pages/affect_create_edit', { authUser })
	}

	/**
	 * Handle form submission for the create action
	 */
	async store({ request, response, auth, session }: HttpContext) {
		const authUser = auth.user

		if (!authUser) {
			response.status(403).redirect().toRoute('auth.login')
			return
		}

		const data = request.body()

		if (!(data.categories instanceof Array))
			data.categories = [data.categories]
		if (data.alt_names && typeof data.alt_names === 'string')
			data.alt_names = data.alt_names.split(',').map((e: string) => e.trim())
		if (data.keywords && typeof data.keywords === 'string')
			data.keywords = data.keywords.split(',').map((e: string) => e.trim()).join()
		if (!includesOr(data.categories, ['positive', 'negative', 'ambiguous', 'other']))
			session.flash('effect-category', { message: 'At least one effect category must be selected.' })
		if (!includesOr(data.categories, ['social', 'introspective', 'cognitive', 'environmental', 'temporal', 'instinctual', 'existential']))
			session.flash('type-category', { message: 'At least one type category must be selected.' })

		const payload = await affectCreateValidator.validate(data)
		const affect = await auth.user.related('listings').create(payload)
		authUser.related('inventory').save(affect)

		await affect.save()

		Affect.atvCreated(affect, authUser)

		await authUser?.load('cart')
		response.redirect().toRoute('affects.show', [affect.id])
	}

	/**
	 * Show individual record
	 */
	async show({ params, view, auth }: HttpContext) {
		const authUser = auth.user
		const affect = await Affect.findBy({ id: params.id })

		await authUser?.load('cart')
		await authUser?.load('inventory')
		if (!affect || (affect.delisted && authUser && (affect.lister !== authUser.id || !authUser.inventory.find(a => a.id === affect.id))))
			return view.render('pages/errors/error', { authUser, error: { code: 404, message: 'Affect not found', details: 'No Affect with this ID exists, or it has been delisted.' } })

		const lister = await User.findBy({ id: affect.lister })

		await affect.load('comments')
		await affect.load('activities')
		affect.comments.reverse()
		affect.activities.reverse()

		;(affect as any)._desc = (function(){
			let d = affect.description
			const r = Array.from(d.matchAll(/(\*\*|__|[*_])(?! )([\s\S]+?)(?! )(\1)/g))
				.map(e => [e[0], (e[1] === '*' || e[1] === '_')? `<i>${e[2]}</i>` : e[1] === '**'? `<b>${e[2]}</b>` : e[1] === '__'? `<u>${e[2]}</u>` : e[2]])
			for(const t of r)
				d = d.replace(t[0], t[1])
			return d
		})()

		let activityUsers: Map<number, User | null> = new Map()
		for (const activity of affect.activities)
			activityUsers.set(activity.user_id, await User.find(activity.user_id))
		let commenters: Map<number, Object> = new Map()
		for (const comment of affect.comments) {
			const user = await User.find(comment.user_id)
			if (!user?.avatar) {
				commenters.set(comment.user_id, { user })
				continue
			}
			const avatarAffect = await Affect.find(user!.avatar)
			const avatar = {
				seed: [avatarAffect].map(a => a? `${a.id}-${a.name}-${a.description}`.padEnd(256, '-').slice(0, 256) : null)[0],
				categories: avatarAffect?.categories.join(',')
			}
			commenters.set(comment.user_id, { user, avatar })
		}

		return view.render('pages/affect', { affect, lister, authUser, activityUsers, commenters })
	}

	/**
	 * Accept rating
	 */
	async rate({ request, params, auth, response }: HttpContext) {
		const authUser = auth.user
		if (!authUser) {
			response.redirect().toRoute('auth.login')
			return
		}

		const affect = await Affect.findBy({ id: params.id })
		if (!affect || affect.delisted) {
			response.notFound()
			return
		}

		const data = request.body()

		if (!data.op)
			return

		if (data.op === 'inc') {
			affect.lockForUpdate((affect) => {
				affect.rated_pos.push(authUser.id)
				affect.save()
			})
		} else if (data.op === 'dec') {
			affect.lockForUpdate((affect) => {
				affect.rated_neg.push(authUser.id)
				affect.save()
			})
		}

		response.json({ rating: affect.rated_pos.length - affect.rated_neg.length })
	}

	/**
	 * Store comment
	 */
	async comment({ request, params, auth, response }: HttpContext) {
		const authUser = auth.user

		if (!authUser) {
			response.status(403).redirect().toRoute('auth.login')
			return
		}

		const affect = await Affect.findBy({ id: params.id })
		if (!affect || affect.delisted) {
			response.notFound()
			return
		}

		const payload = await request.validateUsing(affectCommentValidator)

		const comment = new Comment()
		comment.user_id = authUser.id
		comment.affect_id = affect.id
		comment.body = payload.body
		await authUser.related('comments').save(comment)
		await affect.related('comments').save(comment)
		await comment.save()

		response.redirect().back()
	}

	/**
	 * Edit individual record
	 */
	async edit({ params, auth, response, view }: HttpContext) {
		const authUser = auth.user
		const affect = await Affect.findBy({ id: params.id })

		if (!authUser) {
			response.status(403).redirect().toRoute('auth.login')
			return
		}
		if (!affect) {
			response.notFound()
			return
		}
		if (affect.lister !== authUser.id && !authUser.roles.includes('ADMIN'))
			response.forbidden()

		await authUser?.load('cart')
		return view.render('pages/affect_create_edit', { existing: affect, authUser })
	}

	/**
	 * Handle form submission for the edit action
	 */
	async update({ params, auth, response, request, session }: HttpContext) {
		const authUser = auth.user
		const affect = await Affect.findBy({ id: params.id })

		if (!authUser) {
			response.status(403).redirect().toRoute('auth.login')
			return
		}
		if (!affect) {
			response.notFound()
			return
		}
		if (affect.lister !== authUser.id && !authUser.roles.includes('ADMIN'))
			response.forbidden()

		const data = request.body()

		if (!(data.categories instanceof Array))
			data.categories = [data.categories]
		if (data.name === affect.name)
			delete data.name
		if (data.alt_names && typeof data.alt_names === 'string')
			data.alt_names = data.alt_names.split(',').map((e: string) => e.trim())
		if (!includesOr(data.categories, ['positive', 'negative', 'ambiguous', 'other']))
			session.flash('effect-category', { message: 'At least one effect category must be selected.' })
		if (!includesOr(data.categories, ['social', 'introspective', 'cognitive', 'environmental', 'temporal', 'instinctual', 'existential']))
			session.flash('type-category', { message: 'At least one type category must be selected.' })
		console.log(data)

		const payload = await affectEditValidator.validate(data)

		affect.name = payload.name?? affect.name
		affect.alt_names = payload.alt_names || []
		affect.description = payload.description
		affect.categories = payload.categories
		affect.price = payload.price

		await affect.save()

		const activity = await affect.related('activities').create({ type: 3 })
		await authUser.related('activities').save(activity)
		if ('name' in affect.$dirty)
			activity.extras = { name: {
				old: affect.$original.name,
				new: affect.$dirty.name
			}}
		if ('description' in affect.$dirty)
			activity.extras = { description: {
				old: affect.$original.description,
				new: affect.$dirty.description
			}}

		await activity.save()

		response.redirect().toRoute('affects.show', [affect.id])
	}

	async delist({ params, auth, response }: HttpContext) {
		const authUser = auth.user
		const affect = await Affect.findBy({ id: params.id })

		if (!authUser) {
			response.status(403).redirect().toRoute('auth.login')
			return
		}
		if (!affect) {
			response.notFound()
			return
		}
		if (affect.lister !== authUser.id && !authUser.roles.includes('ADMIN'))
			response.forbidden()

		affect.delisted = true
		await affect.save()

		const activity = await authUser.related('activities').create({ type: 4 })
		await affect.related('activities').save(activity)

		await activity.save()

		response.redirect().back()
	}
	async relist({ params, auth, response }: HttpContext) {
		const authUser = auth.user
		const affect = await Affect.findBy({ id: params.id })

		if (!authUser) {
			response.status(403).redirect().toRoute('auth.login')
			return
		}
		if (!affect) {
			response.notFound()
			return
		}
		if (affect.lister !== authUser.id && !authUser.roles.includes('ADMIN'))
			response.forbidden()

		affect.delisted = false
		await affect.save()

		const activity = await authUser.related('activities').create({ type: 7 })
		await affect.related('activities').save(activity)

		await activity.save()

		response.redirect().back()
	}
}

function includesOr(array: string[], terms: string[]) {
	for (let t of terms)
		if (!array.includes(t))
			return false
	return true
}