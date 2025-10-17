import Affect from '#models/affect'
import User from '#models/user'
import { profileEditValidator } from '#validators/profile_edit'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfilesController {

	async show({ params, view, auth }: HttpContext) {
		const authUser = auth.user

		const user = (await User.findBy({ username: params.username }))
		if (!user)
			return view.render('pages/errors/error', { authUser, error: { code: 404, message: 'Profile not found', details: 'No user with this username exists.' } })

		await user.load('listings')
		await user.load('inventory')
		await user.load('activities')

		user.activities.reverse()

		let listers: Map<number, User | null> = new Map()
		for (const affect of user.inventory)
			listers.set(affect.lister, await User.find(affect.lister))

		let activityAffects: Map<number, Affect | null> = new Map()
		for (const activity of user.activities)
			activityAffects.set(activity.affect_id, await Affect.find(activity.affect_id))

		const avatarAffect = await Affect.find(user.avatar)
		const avatar = {
			seed: [avatarAffect].map(a => a? `${a.id}-${a.name}-${a.description}`.padEnd(256, '-').slice(0, 256) : null)[0],
			categories: avatarAffect?.categories.join(',')
		}

		await authUser?.load('cart')
		return view.render('pages/profile', { authUser, user, listers, activityAffects, avatar })
	}
	async update({ params, view, auth, request, response, session }: HttpContext) {
		const authUser = auth.user

		const user = (await User.find(params.id))

		await authUser?.load('cart')
		if (user?.id !== authUser?.id)
			return view.render('pages/errors/error', { authUser, error: { code: 403, message: 'Forbidden', details: 'Cannot edit profile.' } })
		if (!user)
			return view.render('pages/errors/error', { authUser, error: { code: 404, message: 'Profile not found', details: 'No user with this username exists.' } })

		try {
			const data = request.body()

			if (data.username === user.username)
				delete data.username
			if (data.bio === user.bio)
				delete data.bio

			const payload = await profileEditValidator.validate(data)

			if (payload.bio)
				user.bio = payload.bio
			if (payload.username)
				user.username = payload.username

			if (!user.$isDirty)
				return

			const extras = {}
			if (user.$dirty.username)
				(extras as any).username = {
					old: user.$original.username,
					new: user.$dirty.username
				}
			if (user.$dirty.bio)
				(extras as any).bio = {
					old: user.$original.bio,
					new: user.$dirty.bio
				}

			const activity = await user.related('activities').create({ type: 5 })
			activity.extras = extras
			await activity.save()

			await user.save()

			response.redirect().toRoute('profile.show', [payload.username?? user.username])
		} catch (e) {
			console.log(e)
			if (e.code === 'E_INVALID_CREDENTIALS') {
				session.flash('invalid_credentials', { message: 'Incorrect email or password.' })
				response.redirect().back()
			}
			else {
				return view.render('pages/errors/error', { authUser, error: { code: 503, message: 'Server error', details: `Error while attempting to edit an user's bio.` } })
			}
		}
	}
	async avatar({ params, auth, response }: HttpContext) {
		const authUser = auth.user

		await authUser?.load('cart')
		if (!authUser) {
			response.redirect().toRoute('auth.login')
			return
		}

		const affect = await Affect.findBy({ id: params.id })
		if (!affect) {
			response.notFound()
			return
		}

		authUser.avatar = affect.id
		await authUser.save()

		const activity = await authUser.related('activities').create({ type: 8 })
		await affect.related('activities').save(activity)

		await activity.save()

		response.redirect().back()
	}
}