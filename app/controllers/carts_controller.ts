import Affect from '#models/affect'
import type { HttpContext } from '@adonisjs/core/http'

export default class CartsController {

	async add({ params, auth, response }: HttpContext) {
		const authUser = auth.user
		if (!authUser) {
			response.redirect().toRoute('auth.login')
			return
		}

		const affect = await Affect.find(params.id)
		if (!affect || affect.delisted) {
			response.notFound()
			return
		}

		await authUser.load('cart')
		await authUser.load('inventory')
		await authUser.load('listings')

		if (authUser.cart.find(a => a.id === affect.id) || authUser.inventory.find(a => a.id === affect.id) || authUser.listings.find(a => a.id === affect.id)) {
			response.redirect().back()
			return
		}

		await authUser.related('cart').attach([affect.id])

		response.redirect().back()
	}
	async remove({ params, auth, response }: HttpContext) {
		console.log('Entered cart.remove')
		const authUser = auth.user
		if (!authUser) {
			response.redirect().toRoute('auth.login')
			return
		}
		console.log('User got')

		const affect = await Affect.find(params.id)
		if (!affect || affect.delisted) {
			response.notFound()
			return
		}
		console.log('Affect got')

		await authUser.load('cart')
		console.log('Cart loaded')

		console.log(authUser.cart)
		if (!authUser.cart.find(a => a.id === affect.id))
			response.status(409).redirect().back()

		console.log('Removing to cart...')
		await authUser.related('cart').detach([affect.id])
		console.log('Removed (assumedly)')

		response.redirect().back()
		console.log('Left cart.remove')
	}
	async buy({ auth, response }: HttpContext) {
		const authUser = auth.user
		if (!authUser) {
			response.redirect().toRoute('auth.login')
			return
		}

		await authUser.load('cart')

		if (authUser.cart.length === 0) {
			response.status(409).redirect().back()
			return
		}
		if (authUser.cart.reduce((prev, cur) => prev + cur.price, 0) > authUser.points) {
			response.status(409).redirect().back()
			return
		}

		for (const affect of authUser.cart) {
			authUser.points -= affect.price
			await authUser.related('inventory').save(affect)
			await authUser.related('cart').detach([affect.id])

			const activity = await authUser.related('activities').create({ type: 6 })
			await affect.related('activities').save(activity)
		}

		response.redirect().back()
	}
}