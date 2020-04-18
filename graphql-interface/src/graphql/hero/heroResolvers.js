const resolvers = {
	Hero: {
		async skills(root, args, context, info) {
			const skills = root.skills.map(skill => context.Skill.findOne(skill))
			
			const results = await Promise.all(skills)

			const all = results.reduce((prev, next) => prev.concat(next), [])

			return all
		}
	},
	Query: {
		async getHero(root, args, context, info) {
			return context.Hero.findAll(args)
		}
	},
	Mutation: {
		async createHero(root, args, context, info) {
			const { id } = await context.Hero.create(args)
			
			return id
		}
	}
}

module.exports = resolvers
