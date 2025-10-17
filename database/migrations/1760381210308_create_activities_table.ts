import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
	protected tableName = 'activities'

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id').primary()

			table.integer('user_id').unsigned().references('users.id').nullable()
			table.integer('affect_id').unsigned().references('affects.id').nullable()
			table.integer('type').notNullable()
			table.json('extras').nullable()

			table.timestamp('created_at')
		})
	}

	async down() {
		this.schema.dropTable(this.tableName)
	}
}