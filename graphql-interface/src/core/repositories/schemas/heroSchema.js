const dynamoose = require("dynamoose")

const schema = new dynamoose.Schema({
	id: {
		type: String,
		required: true,
		hashKey: true
	},
	name: {
		type: String,
		required: true
	},
	skills: [{
		type: String,
		required: true
	}]
})

const model = dynamoose.model(process.env.HEROES_TABLE, schema)

module.exports = model