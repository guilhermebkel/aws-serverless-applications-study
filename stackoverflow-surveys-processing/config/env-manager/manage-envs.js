const AWS = require("aws-sdk")

const { ssmPrefix, variables } = require("./env")

const SSM = new AWS.SSM({
	region: variables.REGION.value
})

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

;(async () => {
	const promises = []

	for(const [key, data] of Object.entries(variables)) {
		const { value, type } = data

		if (!value) {
			continue
		}

		console.log("Scheduling insertion...")

		const result = SSM.putParameter({
			Overwrite: true,
			Name: `${ssmPrefix}/${key}`,
			Type: type,
			Value: value
		}).promise()

		promises.push(result)

		await sleep(500)
	}

	const result = await Promise.all(promises)

	console.log("Result: ", result)
})()