import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
	protected tableName = 'affects'

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id', { primaryKey: true }).notNullable()
			table.index(['name'])

			table.string('name').checkLength('>=', 3).checkLength('<=', 128).notNullable().unique()
			table.json('alt_names').checkLength('<=', 512).nullable()
			table.string('description').checkLength('>=', 3).checkLength('<=', 2048).notNullable().unique()
			table.string('keywords').checkLength('<=', 512).nullable()
			table.json('categories').notNullable()
			table.decimal('price', 8, 2).checkBetween([1, 10000]).notNullable()
			table.integer('lister').notNullable().references('users.id')

			table.json('rated_pos').defaultTo('[]').notNullable()
			table.json('rated_neg').defaultTo('[]').notNullable()

			table.boolean('delisted').notNullable().defaultTo(false)

			table.timestamp('created_at').notNullable()
			table.timestamp('updated_at').nullable()
		})
	}

	async down() {
		this.schema.dropTable(this.tableName)
	}
}