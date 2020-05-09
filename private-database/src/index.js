const faker = require("faker")

const { HeroSchema, sequelize } = require("./database")

const handler = async event => {
	try {
		await sequelize.authenticate()

		console.log("Connected to database...")
	} catch(error) {
		return {
			statusCode: 500,
			body: "ERROR!"
		}
	}

	await HeroSchema.sync()

	const result = await HeroSchema.create({
		name: faker.name.title(),
		skill: faker.name.jobTitle()
	})

	const all = await HeroSchema.findAll({
		raw: true,
		attributes: ["id", "name", "skill"]
	})

	return {
		body: JSON.stringify({ result, all }, null, 2)
	}
}

exports.handler = handler