const AWS = require("aws-sdk")
const { Writable, pipeline } = require("stream")
const csvToJson = require("csvtojson")

class Handler {
	constructor({ StorageService, QueueService }) {
		this.StorageService = StorageService
		this.QueueService = QueueService

		this.queueName = process.env.SQS_QUEUE
	}

	static get SDKs() {
		const host = process.env.LOCALSTACK_HOST || "localhost"
		const s3Port = process.env.S3_PORT || 4572
		const sqsPort = process.env.SQS_PORT || 4576

		const isLocal = process.env.IS_LOCAL === "true"

		const s3Endpoint = new AWS.Endpoint(`http://${host}:${s3Port}`)
		const s3Config = {
			endpoint: s3Endpoint,
			s3ForcePathStyle: true
		}

		const sqsEndpoint = new AWS.Endpoint(`http://${host}:${sqsPort}`)
		const sqsConfig = {
			endpoint: sqsEndpoint
		}

		if (!isLocal) {
			delete s3Config.endpoint
			delete sqsConfig.endpoint
		}

		return {
			s3: new AWS.S3(s3Config),
			sqs: new AWS.SQS(sqsConfig)
		}
	}

	async getQueueUrl() {
		const { QueueUrl } = await this.QueueService.getQueueUrl({
			QueueName: this.queueName
		}).promise()

		return QueueUrl
	}

	processDataOnDemand(queueUrl) {
		const writableStream = new Writable({
			write: (chunk, enconding, done) => {
				const item = chunk.toString()

				console.log(`Sending... ${item} to SQS at ${new Date().toISOString()}`)

				this.QueueService.sendMessage({
					QueueUrl: queueUrl,
					MessageBody: item
				}, done)
			}
		})

		return writableStream
	}

	async pipefyStreams(...args) {
		return new Promise((resolve, reject) => {
			pipeline(
				...args,
				error => error ? reject(error) : resolve()
			)
		})
	}

	async main(event) {
		try {
			const [{ s3: { bucket: { name }, object: { key }}}] = event.Records

			const queueUrl = await this.getQueueUrl()

			const params = {
				Bucket: name,
				Key: key
			}

			/**
			 * The way below it is needed to use stream events
			 * to handle error and process finish, but using
			 * the "this.pipefyStreams" method we do it using
			 * a basic promise.
			 * 
			 * this.StorageService.getObject(params)
			 * 	.createReadStream()
			 * 	.pipe(csvToJson())
			 * 	.pipe(this.processDataOnDemand(queueUrl))
			 * 
			 */

			await this.pipefyStreams(
				this.StorageService.getObject(params).createReadStream(),
				csvToJson(),
				this.processDataOnDemand(queueUrl)
			)

			console.log("Process finished...", new Date().toISOString())

			return {
				statusCode: 200,
				body: "Process finished with success!"
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

const { s3, sqs } = Handler.SDKs

const handler = new Handler({
	StorageService: s3,
	QueueService: sqs
})

module.exports = handler.main.bind(handler)