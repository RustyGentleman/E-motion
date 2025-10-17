import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
	protected tableName = 'users'

	async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.integer('points').unsigned().defaultTo(1000).notNullable()
		})
	}

	async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn('points')
		})
	}
}