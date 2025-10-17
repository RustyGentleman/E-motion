import vine from '@vinejs/vine'

export const userSignupValidator = vine.compile(
	vine.object({
		username: vine.string().alphaNumeric().minLength(3).maxLength(64).unique({ table: 'users', column: 'username' }),
		email: vine.string().email(),
		password: vine.string().confirmed({ confirmationField: 'password-check' }),
	})
)