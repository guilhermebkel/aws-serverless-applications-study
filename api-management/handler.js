'use strict'

const AWS = require("aws-sdk")
const moment = require("moment")

const apiGateway = new AWS.APIGateway()

const hello = async event => {
  return {
    statusCode: 200,
    body: "HELLO!"
  }
}

const usage = async event => {
  const { from, to, usagePlanId, keyId } = event.queryStringParameters

  const usage = await apiGateway.getUsage({
    endDate: moment(to).format("YYYY-MM-DD"),
    startDate: moment(from).format("YYYY-MM-DD"),
    usagePlanId,
    keyId
  }).promise()

  console.log(usage)

  return {
    statusCode: 200,
    body: JSON.stringify(usage, null, 2)
  }
}

const usagePlans = async event => {
  const result = await apiGateway.getUsagePlans().promise()

  console.log(result)

  return {
    statusCode: 200,
    body: JSON.stringify(result, null, 2)
  }
}

const addKey = async event => {
  const { name, usagePlanId } = event.queryStringParameters

  const planKeys = await apiGateway.getUsagePlanKeys({ usagePlanId }).promise()

  const { items: [{ type: keyType }]} = planKeys

  const apiKeyCreated = await apiGateway.createApiKey({
    name,
    enabled: true
  }).promise()

  const [apiKeyId, apiKeyToken] = [apiKeyCreated.id, apiKeyCreated.value]

  await apiGateway.createUsagePlanKey({
    keyId: apiKeyId,
    keyType,
    usagePlanId
  }).promise()

  const message = `Use ${apiKeyId} to check quota and 'x-api-key: ${apiKeyToken}' to make requests.`

  return {
    statusCode: 200,
    body: JSON.stringify({
      apiKeyToken,
      apiKeyId,
      message
    }, null, 2)
  }
}

module.exports = {
  hello,
  usage,
  usagePlans,
  addKey
}