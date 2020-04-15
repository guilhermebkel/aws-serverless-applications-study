const uuid = require("uuid")
const Joi = require("@hapi/joi")

const decoratorValidator = require("./util/decoratorValidator")
const globalEnum = require("./util/globalEnum")

class Handler {
  constructor({ DatabaseService }) {
		this.DatabaseService = DatabaseService
		this.dynamodbTable = process.env.DYNAMODB_TABLE
	}

	static validator() {
		return Joi.object({
			nome: Joi.string().max(100).min(2).required(),
			poder: Joi.string().max(20).required()
		})
	}
	
	async insertItem(params) {
		return this.DatabaseService.put(params).promise()
	}

	prepareData(data) {
		const params = {
			TableName: this.dynamodbTable,
			Item: {
				...data,
				id: uuid.v1(),
				createdAt: new Date().toISOString()
			}
		}

		return params
	}

	handleSuccess(data) {
		const response = {
			statusCode: 200,
			body: JSON.stringify(data)
		}

		return response
	}

	handleError(data) {
		return {
			statusCode: data.statusCode || 501,
			headers: { "Content-Type": "text/plain" },
			body: "Could not create item!"
		}
	}

  async main(event) {
    try {
			const data = event.body

			const dbParams = this.prepareData(data)

			await this.insertItem(dbParams)

			return this.handleSuccess(dbParams.Item)

    } catch (error) {
      console.error(error)

      return this.handleError({ statusCode: 500 })
    }
  }
}

const AWS = require("aws-sdk")
const dynamoDB = new AWS.DynamoDB.DocumentClient()

const handler = new Handler({
  DatabaseService: dynamoDB
})

module.exports = decoratorValidator(
	handler.main.bind(handler),
	Handler.validator(),
	globalEnum.ARG_TYPE.BODY
)
