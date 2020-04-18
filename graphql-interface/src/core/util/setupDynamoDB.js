const dynamoose = require("dynamoose")

function setupDynamoDBClient() {
	const host = process.env.LOCALSTACK_HOST
  const port = process.env.DYNAMODB_PORT
  const isLocal = process.env.IS_LOCAL || process.env.NODE_ENV === "development"

	if (isLocal) {
		dynamoose.local(`http://${host}:${port}`)
	}
}

module.exports = setupDynamoDBClient