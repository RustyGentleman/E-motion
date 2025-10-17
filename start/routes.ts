/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AffectController from '#controllers/affect_controller'
import AuthController from '#controllers/auth_controller'
import CartsController from '#controllers/carts_controller'
import ProfilesController from '#controllers/profiles_controller'
import Affect from '#models/affect'
import User from '#models/user'
import router from '@adonisjs/core/services/router'

//# General pages
router.get('/', async ({ auth, view }) => {
	const authUser = auth.user

	const all = (await Affect.all()).map(e => e.$attributes)
	let i = all.length
	while (i != 0) {
		let r = Math.floor(Math.random() * i--);
		[all[i], all[r]] = [all[r], all[i]]
	}
	const affects = all.slice(0, 3)
	let listers: Map<number, User | null> = new Map()
	for (const affect of affects)
		listers.set(affect.lister, await User.find(affect.lister))

	await authUser?.load('cart')
	return view.render('pages/home', { authUser, affects, listers })
}).as('home')

//# Product pages
router.group(() => {
	router.get('/affects/', [AffectController, 'catalog']).as('catalog')
	router.get('/affects/list', [AffectController, 'create']).as('new')
	router.post('/affects/list', [AffectController, 'store']).as('store')
	router.get('/affects/:id', [AffectController, 'show']).as('show')
	router.post('/affects/:id', [AffectController, 'comment']).as('comment')
	router.post('/affects/delist/:id', [AffectController, 'delist']).as('delist')
	router.post('/affects/relist/:id', [AffectController, 'relist']).as('relist')
	router.get('/affects/edit/:id', [AffectController, 'edit']).as('edit')
	router.post('/affects/edit/:id', [AffectController, 'update']).as('update')
	router.post('/affects/rate/:id', [AffectController, 'rate']).as('rate')
}).as('affects')

//# Social pages
router.group(() => {
	router.get('profile/:username', [ProfilesController, 'show']).as('show')
	router.post('profile/update/:id', [ProfilesController, 'update']).as('update')
	router.post('profile/avatar/:id', [ProfilesController, 'avatar']).as('avatar')
}).as('profile')

//# Auth pages
router.group(() => {
	router.get('/login', [AuthController, 'showLogin']).as('login')
	router.post('/login', [AuthController, 'login']).as('postLogin')
	router.get('/signup', [AuthController, 'showSignup']).as('signup')
	router.post('/signup', [AuthController, 'signup']).as('postSignup')
	router.get('/logout', [AuthController, 'logout']).as('logout')
}).as('auth')

//# Cart pages
router.group(() => {
	router.post('/cart/:id', [CartsController, 'add']).as('add')
	router.post('/cart/remove/:id', [CartsController, 'remove']).as('remove')
	router.post('/cart/buy', [CartsController, 'buy']).as('buy')
}).as('cart')