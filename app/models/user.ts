import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import Affect from './affect.js'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Activity from './activity.js'
import Comment from './comment.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
   uids: ['id', 'email'],
   passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
   @column({ isPrimary: true })
   declare id: number
   @column()
   declare username: string | null
   @column()
   declare email: string
   @column({ serializeAs: null })
   declare password: string
	@column()
	declare points: number

   @column()
   declare bio: string
	@column({ consume: (value) => JSON.parse(value), prepare: (value) => JSON.stringify(value) })
	declare roles: string[]
	@hasMany(() => Activity, { foreignKey: 'user_id' })
	declare activities: HasMany<typeof Activity>
	@hasMany(() => Comment, { foreignKey: 'user_id' })
	declare comments: HasMany<typeof Comment>

	@hasMany(() => Affect, { foreignKey: 'lister' })
	declare listings: HasMany<typeof Affect>
	@manyToMany(() => Affect, { pivotTable: 'user_inventory', pivotTimestamps: true })
	declare inventory: ManyToMany<typeof Affect>
	@manyToMany(() => Affect, { pivotTable: 'user_cart', pivotTimestamps: true })
	declare cart: ManyToMany<typeof Affect>

	@column()
	declare avatar: number

   @column.dateTime({ autoCreate: true })
   declare createdAt: DateTime
   @column.dateTime({ autoCreate: true, autoUpdate: true })
   declare updatedAt: DateTime | null

	static async atvCreate(user: User) {
		const activity = await user.related('activities').create({ type: 0 })
		await activity.save()
	}
}
