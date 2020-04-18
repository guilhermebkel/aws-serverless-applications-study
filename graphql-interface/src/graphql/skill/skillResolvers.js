const resolvers = {
	Query: {
		async getSkill(root, args, context, info) {
			return "Hello world!"
		}
	},
	Mutation: {
		async createSkill(root, args, context, info) {
			return "Hello world!"
		}
	}
}

module.exports = resolvers
