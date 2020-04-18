const dynamoose = require("dynamoose")

const isLocal = require("./isLocal")

function setupDynamoDBClient() {
	const host = process.env.LOCALSTACK_HOST
  const port = process.env.DYNAMODB_PORT

	if (isLocal) {
		dynamoose.local(`http://${host}:${port}`)
	}
}

module.exports = setupDynamoDBClient