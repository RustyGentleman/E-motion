import vine from '@vinejs/vine'

export const affectCommentValidator = vine.compile(
	vine.object({
		body: vine.string().maxLength(256).escape(),
	})
)