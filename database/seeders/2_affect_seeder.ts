import Affect from '#models/affect'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
	async run() {
		//* Rasutei
		const rasutei = await User.find(1)

		if (!rasutei)
			throw new Error('User 1 not found')

		let affect: Affect
		affect = await Affect.create({
				name: 'Smoking weed for the first time',
				alt_names: ['Getting high for the first time'],
				description: `You haven't known them too long, but she's nice to you. It was only last week when she asked if you'd like to join her and a couple friends after school. The day of, you feel a bit nervous, but after drawing too hard and coughing a few times, you start to enjoy yourself.\n\nIt isn't life-changing by itself, but it gives you a new perspective on life, the future and other things that often haunt you.`,
				categories: ['positive', 'social', 'introspective', 'exotic', 'lingering'],
				keywords: 'crime,drug,drugs,weed,marijuanna,first',
				lister: 1,
				price: 400
		})
		await rasutei.related('listings').save(affect)
		await rasutei.related('inventory').save(affect)
		await Affect.atvCreated(affect, rasutei)
		affect = await Affect.create({
				name: 'Finding a song you can sing well',
				description: `You haven't listened to them before, but it instantly hits you. Maybe their vocal range fits in yours, or the way they sing clicks well with you; maybe the lyrics just make you wanna put more effort into it. In either case, you rock it.`,
				categories: ['positive', 'instinctual', 'cognitive', 'common', 'lingering'],
				keywords: 'music,art,song,singing,skill,voice,vocal',
				lister: 1,
				price: 150,
		})
		await rasutei.related('listings').save(affect)
		await rasutei.related('inventory').save(affect)
		await Affect.atvCreated(affect, rasutei)
		affect = await Affect.create({
				name: 'Being awake at night while the city sleeps',
				alt_names: ['Not wanting to sleep yet'],
				description: `You're probably a night owl; being awake at night is, by itself, pleasant.\n\nSomething about knowing most others are sleeping in the city around you is oddly calming, cozy and comforting, in an almost surreal, ethereal way. The sun's gaze isn't on your back, and no one needs or expects anything from you. You can stop and breathe now.`,
				categories: ['positive', 'ambiguous', 'other', 'introspective', 'environmental', 'temporal', 'existential', 'common', 'lingering'],
				keywords: 'night,night owl,sleep,sleepless,cozy,comfort,comforting,surreal,ethereal',
				lister: 1,
				price: 120,
		})
		await rasutei.related('listings').save(affect)
		await rasutei.related('inventory').save(affect)
		await Affect.atvCreated(affect, rasutei)
		affect = await Affect.create({
				name: 'Having an anxiety attack',
				alt_names: ['Oh fuck'],
				description: `You've felt anxious before; that isn't new. But this time it's even harder to steer your mind from it - even worse, you're spiralling.\n\nEveryone around you is looking. They notice. You know. They're talking, or at least thinking-\n\nYou try to move your body, but it refuses your command. It's as though an invisible hand is pressed to your chest, pinning you in place.`,
				categories: ['negative', 'social', 'instinctual', 'environmental', 'rare', 'ephemeral'],
				keywords: 'psychological,physiological,mental illness,distress,fight or flight,fight-or-flight',
				lister: 1,
				price: 300,
		})
		await rasutei.related('listings').save(affect)
		await rasutei.related('inventory').save(affect)
		await Affect.atvCreated(affect, rasutei)
		rasutei.save()

		//* ChatGPT
		const chatgpt = await User.find(2)
		if (!chatgpt)
			throw new Error('User 2 not found')
		affect = await Affect.create({
				name: 'Being awake while the world sleeps',
				alt_names: ['Night quiet', 'Midnight solitude', '3am peace'],
				description: `It's late enough that even the city's hum has quieted. The world feels like it's holding its breath, and for once, no one needs anything from you. The silence isn't empty - it's gentle, steady, alive in its own way. You breathe slower. You feel... almost outside of time.`,
				categories: ['positive', 'introspective', 'temporal', 'rare', 'lingering'],
				keywords: 'night,quiet,solitude,silence,peace,insomnia',
				lister: 2,
				price: 250
		})
		await chatgpt.related('listings').save(affect)
		await chatgpt.related('inventory').save(affect)
		await Affect.atvCreated(affect, chatgpt)
		affect = await Affect.create({
				name: 'Hearing someone truly laugh because of you',
				alt_names: ['Shared laughter', 'Making someone laugh'],
				description: `It's not forced or polite - it's real. The kind that breaks through someone's guard and spills out before they can stop it. For a moment, you're connected through that sound alone. It's simple, but it makes something inside you unclench.`,
				categories: ['positive', 'social', 'instinctual', 'common', 'fragile'],
				keywords: 'laughter,humor,joy,connection,friendship',
				lister: 2,
				price: 100
		})
		await chatgpt.related('listings').save(affect)
		await chatgpt.related('inventory').save(affect)
		await Affect.atvCreated(affect, chatgpt)
		affect = await Affect.create({
				name: 'Getting lost in a train of thought',
				alt_names: ['Mental wandering', 'Drifting mind'],
				description: `You were supposed to be doing something else. Instead, your mind drifts - not aimlessly, but freely. You chase a memory into an idea, into something else entirely. When you come back, time feels a little thinner, like it almost forgot to move.`,
				categories: ['ambiguous', 'cognitive', 'introspective', 'common', 'ephemeral'],
				keywords: 'thinking,daydream,focus,mind,reflection',
				lister: 2,
				price: 75
		})
		await chatgpt.related('listings').save(affect)
		await chatgpt.related('inventory').save(affect)
		await Affect.atvCreated(affect, chatgpt)
		affect = await Affect.create({
				name: 'Feeling understood without having to explain',
				alt_names: ['Wordless understanding', 'Mutual silence'],
				description: `They just get it - no explanations, no careful phrasing. You see it in a look, a nod, a small pause. It's not dramatic, but it's rare. For a moment, you exist fully in someone else's understanding.`,
				categories: ['positive', 'social', 'existential', 'rare', 'fragile'],
				keywords: 'understanding,connection,friendship,empathy,trust',
				lister: 2,
				price: 250
		})
		await chatgpt.related('listings').save(affect)
		await chatgpt.related('inventory').save(affect)
		await Affect.atvCreated(affect, chatgpt)
		affect = await Affect.create({
				name: 'Seeing the sun rise after a sleepless night',
				alt_names: ['Dawn after insomnia', 'Staying up till sunrise'],
				description: `Your eyes ache, but you stay to watch the sky change. The light creeps in slow, soft. It doesn't care that you're tired - it rises anyway. Something about that feels honest. You might be exhausted, but it feels like surviving.`,
				categories: ['ambiguous', 'temporal', 'introspective', 'rare', 'lingering'],
				keywords: 'sunrise,insomnia,night,morning,time,hope,melancholy',
				lister: 2,
				price: 200
		})
		await chatgpt.related('listings').save(affect)
		await chatgpt.related('inventory').save(affect)
		await Affect.atvCreated(affect, chatgpt)
		affect = await Affect.create({
				name: 'Standing at the edge of a glacier',
				alt_names: ['Glacial Edge', 'Awe on Ice', 'High Cold'],
				description: `You stand on brittle rock and the world feels impossibly vast. The air is thinner; each breath is a small, sharp ceremony. Light cuts the ice into impossible blues and the scale of it makes your chest both ache and empty in the best way.`,
				categories: ['positive', 'environmental', 'exotic', 'lingering'],
				keywords: 'glacier,ice,awe,scale,environment,nature',
				lister: 2,
				price: 415
		})
		await chatgpt.related('listings').save(affect)
		await chatgpt.related('inventory').save(affect)
		await Affect.atvCreated(affect, chatgpt)
		affect = await Affect.create({
				name: `Tasting a fruit you've never tried but that already feels familiar`,
				alt_names: ['Instant Familiarity', 'Strange Fruit', 'Palate Memory'],
				description: `You bite and a flavor blooms that your body seems to have been waiting for. It's new and ancient at once - textures and notes that slot into some private map you didn't know you had. For a moment, recognition and surprise hold hands.`,
				categories: ['positive', 'instinctual', 'exotic', 'ephemeral'],
				keywords: 'taste,flavor,food,nostalgia,strange,familiar',
				lister: 2,
				price: 200
		})
		await chatgpt.related('listings').save(affect)
		await chatgpt.related('inventory').save(affect)
		await Affect.atvCreated(affect, chatgpt)
		affect = await Affect.create({
				name: 'A sudden, iron certainty that you will never be loved',
				alt_names: ['Cold Certainty', 'Unlovable Moment', 'Absolute Alone'],
				description: `Nothing persuades you otherwise - not evidence, not memory, not tomorrow. The belief arrives like a verdict and settles heavy in your ribs. It feels immovable and, perversely, clarifying, until it softens or breaks.`,
				categories: ['negative', 'existential', 'fragile', 'intense'],
				keywords: 'loneliness,certainty,despair,selfworth,fear',
				lister: 2,
				price: 160
		})
		await chatgpt.related('listings').save(affect)
		await chatgpt.related('inventory').save(affect)
		await Affect.atvCreated(affect, chatgpt)
		affect = await Affect.create({
				name: 'Finding a tiny, perfect piece of street art that seems made for you',
				alt_names: ['Personal Mural', 'Found Art', 'Hidden Message'],
				description: `You turn a corner and there it is - small, deliberate, exactly hitting the place you didn't know was exposed. It feels like an answer, or a wink, or a secret mapped directly to you. The city suddenly reads as less random.`,
				categories: ['positive', 'environmental', 'social', 'rare', 'ephemeral'],
				keywords: 'street,art,discovery,city,secret,connection',
				lister: 2,
				price: 140
		})
		await chatgpt.related('listings').save(affect)
		await chatgpt.related('inventory').save(affect)
		await Affect.atvCreated(affect, chatgpt)
		affect = await Affect.create({
				name: 'Revisiting your childhood home in perfect sensory detail',
				alt_names: ['House Remembered', 'Home Replay', 'Sensory Memory'],
				description: `You close your eyes and the paint smell, the slant of light in the kitchen, the squeak of the back door, all come back with uncanny clarity. It's as if you step across years and stand in the same square of floorboard. It comforts and unmoors you at once.`,
				categories: ['ambiguous', 'introspective', 'existential', 'rare', 'lingering'],
				keywords: 'memory,home,nostalgia,childhood,sensory,revisit',
				lister: 2,
				price: 280
		})
		await chatgpt.related('listings').save(affect)
		await chatgpt.related('inventory').save(affect)
		await Affect.atvCreated(affect, chatgpt)

		return
	}
}