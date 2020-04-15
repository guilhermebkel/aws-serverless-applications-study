'use strict'

const axios = require("axios")
const cheerio = require("cheerio")
const AWS = require("aws-sdk")
const uuid = require("uuid")

const dynamoDB = new AWS.DynamoDB.DocumentClient()

const settings = require("./config/settings")

class Handler {
  static async main(event) {
    const { data } = await axios.get(settings.commitMessageUrl)

    const $ = cheerio.load(data)

    const [commitMessage] = $("#content").text().trim().split("\n")

    const params = {
      TableName: settings.dbTableName,
      Item: {
        commitMessage,
        id: uuid.v1(),
        createdAt: new Date().toISOString()
      }
    }

    await dynamoDB.put(params).promise()

    return {
      statusCode: 200
    }
  }
}

module.exports = {
  scheduler: Handler.main
}