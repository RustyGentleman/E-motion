import vine from '@vinejs/vine'

export const profileEditValidator = vine.compile(
	vine.object({
		bio: vine.string().maxLength(512).optional(),
		username: vine.string().alphaNumeric().minLength(3).maxLength(64).unique({ table: 'users', column: 'username' }).optional(),
	})
)