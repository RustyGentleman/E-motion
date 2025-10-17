import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Comment extends BaseModel {
	@column({ isPrimary: true })
	declare id: number

	@column()
	declare user_id: number
	@column()
	declare affect_id: number

	@column()
	declare body: string

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime
	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime
}