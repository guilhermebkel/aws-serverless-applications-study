class Handler {
	async main(event) {
		try {
			const [{ body, messageId }] = event.Records

			const item = JSON.parse(body)

			console.log(`Received...${item} for message #${messageId} at ${new Date().toISOString()}`)

			return {
				statusCode: 200,
				body: "Processed item with success!"
			}
		} catch(error) {
			console.log(error)
			return {
				statusCode: 500,
				error: "Internal server error"
			}
		}
	}
}

const handler = new Handler()

module.exports = handler.main.bind(handler)