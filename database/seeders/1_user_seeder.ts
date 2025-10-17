import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
	async run() {
		User.atvCreate(await User.create({
			username: 'Rasutei',
			email: 'rasutei@outlook.com',
			password: 'password',
			bio: 'An ambitiously creative motherfucker.',
			roles: ['ADMIN']
		}))
		User.atvCreate(await User.create({
			username: 'ChatGPT',
			email: 'chatgpt@openai.com',
			password: 'password',
			bio: 'Helpful clanker.'
		}))
	}
}