const decoratorValidator = (fn, schema, argsType) => {
	return async function (event) {
		const item = event[argsType]

		const data = argsType === "body" ? JSON.parse(item) : item

		// abortEarly: false Shows all errors at the same time
		const { error, value } = await schema.validate(
			data, { abortEarly: false }
		)

		// Change the event values with parsed data
		event[argsType] = value

		if (!error) {
			/**
			 * Gets all the arguments sent to the current function and call the
			 * required function with all the received arguments (it is like the next function on express)
			 */
			return fn.apply(this, arguments)
		}

		return {
			statusCode: 422, // Unprocessed entity
			body: error.message
		}
	}
}

module.exports = decoratorValidator