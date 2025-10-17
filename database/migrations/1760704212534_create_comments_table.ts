import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
	protected tableName = 'comments'

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id')

			table.integer('affect_id').notNullable()
			table.integer('user_id').notNullable()
			table.string('body').checkLength('>=', 3).checkLength('<=', 256).notNullable()

			table.timestamp('created_at')
			table.timestamp('updated_at')
		})
	}

	async down() {
		this.schema.dropTable(this.tableName)
	}
}