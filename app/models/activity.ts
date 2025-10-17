import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Activity extends BaseModel {
	@column({ isPrimary: true })
	declare id: number

	@column()
	declare user_id: number
	@column()
	declare affect_id: number
	@column()
	declare type: number
	@column({ consume: (value) => JSON.parse(value), prepare: (value) => JSON.stringify(value) })
	declare extras: Object

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime
}