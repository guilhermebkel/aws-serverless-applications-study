const resolvers = {
	Query: {
		async getHero(root, args, context, info) {
			return "Hello world!"
		}
	},
	Mutation: {
		async createHero(root, args, context, info) {
			return "Hello world!"
		}
	}
}

module.exports = resolvers
