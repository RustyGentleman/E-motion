import User from '#models/user'
import { userSignupValidator } from '#validators/user_signup'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
	async showSignup({ view }: HttpContext) {
		return view.render('pages/signup')
	}

	async signup({ request, response, auth }: HttpContext) {
		const { username, email, password } = await request.validateUsing(userSignupValidator)
		const user = await User.create({ username, email, password })

		User.atvCreate(user)

		await auth.use('web').login(user)
		response.redirect().toRoute('home')
	}

	async showLogin({ view, auth, response }: HttpContext) {
		const authUser = auth.user

		if (authUser)
			response.redirect().toRoute('home')

		await authUser?.load('cart')
		return view.render('pages/login', { authUser })
	}

	async login({ request, response, auth, session }: HttpContext) {
		const { email, password } = request.only(['email', 'password'])

		try {
			const user = await User.verifyCredentials(email, password)
			await auth.use('web').login(user)

			response.redirect().back()
		} catch (error) {
			console.log(error)
			if (error.code === 'E_INVALID_CREDENTIALS') {
				session.flash('invalid_credentials', { message: 'Incorrect email or password.' })
				response.redirect().back()
			}
		}
	}

	async logout({ auth, response }: HttpContext) {
		await auth.use('web').logout()
		response.redirect().back()
	}
}