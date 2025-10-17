import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Activity from './activity.js'
import User from './user.js'
import Comment from './comment.js'

export default class Affect extends BaseModel {
	@column({ isPrimary: true })
	declare id: number
	@column()
	declare name: string
	@column({ consume: (value) => JSON.parse(value), prepare: (value) => JSON.stringify(value) })
	declare alt_names: string[]
	@column()
	declare description: string
	@column()
	declare keywords: string
	@column({ consume: (value) => JSON.parse(value), prepare: (value) => JSON.stringify(value) })
	declare categories: string[]
	@column()
	declare price: number
	@column()
	declare lister: number

	@hasMany(() => Activity, { foreignKey: 'affect_id' })
	declare activities: HasMany<typeof Activity>

	@column({
		prepare: (value: number[] | null) => (value ? JSON.stringify(value) : null),
		consume: (value: string | null) => (value ? JSON.parse(value) : null),
	})
	declare rated_pos: Array<number>
	@column({
		prepare: (value: number[] | null) => (value ? JSON.stringify(value) : null),
		consume: (value: string | null) => (value ? JSON.parse(value) : null),
	})
	declare rated_neg: Array<number>
	@hasMany(() => Comment, { foreignKey: 'affect_id' })
	declare comments: HasMany<typeof Comment>

	@column()
	declare delisted: boolean

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime
	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime

	static async atvCreated(affect: Affect, lister: User) {
		const activity = await lister.related('activities').create({ type: 1 })
		affect.related('activities').save(activity)
		lister.related('activities').save(activity)

		await activity.save()
	}
}