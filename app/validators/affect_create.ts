import vine from '@vinejs/vine'

export const affectCreateValidator = vine.compile(
	vine.object({
		name: vine.string().trim().minLength(3).maxLength(128).unique({ table: 'affects', column: 'name' }).escape(),
		alt_names: vine.array(vine.string().trim().minLength(3).maxLength(128).escape()).optional(),
		description: vine.string().trim().minLength(3).maxLength(2048).escape(),
		keywords: vine.string().trim().maxLength(256).optional(),
		categories: vine.array(vine.string().trim().minLength(1).in([
			"positive", "negative", "ambiguous", "other",
			"social", "introspective", "cognitive", "environmental", "temporal", "instinctual", "existential",
			"common", "rare", "exotic", "ephemeral", "lingering", "fragile"
		])).minLength(2),
		price: vine.number().min(1).max(1000),
	})
)