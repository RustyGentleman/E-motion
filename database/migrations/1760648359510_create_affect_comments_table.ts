import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
	protected tableName = 'affect_comments'

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id')

			table.string('body').notNullable().checkLength('>=', 3).checkLength('<=', 256)
			table.integer('reply_to').nullable().references('affect_comments.id')

			table.timestamp('created_at')
			table.timestamp('updated_at')
		})
	}

	async down() {
		this.schema.dropTable(this.tableName)
	}
}