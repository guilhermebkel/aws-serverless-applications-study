const typeDefinition = `
	type Skill {
		id: String
		name: String
		value: Int
	}

	type Hero {
		id: String
		name: String
		skills(id: String): [Skill]
	}

	type Query {
		getHero(
			id: String
			name: String
		): [Hero]
	}

	type Mutation {
		createHero(
			name: String!
			skills: [String!]!
		): String
	}
`

module.exports = typeDefinition