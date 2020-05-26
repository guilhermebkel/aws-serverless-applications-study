'use strict'

const env = require("env-var")
const AWS = require("aws-sdk")

const ecs = new AWS.ECS()

const environment = {
  taskConfiguration: {
    cluster: env.get("ECS_CLUSTER_NAME").required().asString(),
    launchType: env.get("ECS_TASK_LAUNCH_TYPE").required().asString(),
    count: env.get("ECS_TASK_COUNT").required().asString(),
    taskDefinition: env.get("ECS_TASK_DEFINITION").required().asString(),
    platformVersion: env.get("ECS_TASK_PLATFORM_VERSION").required().asString()
  },
  containerConfiguration: {
    name: env.get("ECS_TASK_CONTAINER_NAME").required().asString(),
    fileEnvName: env.get("ECS_TASK_CONTAINER_FILE_ENV").required().asString()
  },
  network: {
    subnets: env.get("ECS_TASK_SUBNETS").required().asArray(),
    securityGroups: env.get("ECS_TASK_SECURITY_GROUPS").required().asArray(),
    assignPublicIp: env.get("ECS_TASK_ASSIGN_PUBLIC_IP").required().asString()
  }
}

const scheduleEcs = async (data, environment) => {
  return ecs.runTask({
    ...environment.taskConfiguration,
    overrides: {
      containerOverrides: [
        {
          name: environment.containerConfiguration.name,
          environment: [
            {
              value: environment.containerConfiguration.fileEnvName,
              value: data
            }
          ]
        }
      ]
    },
    networkConfiguration: {
      awsvpcConfiguration: {
        ...environment.network
      }
    }
  }).promise()
}

const hello = async event => {
  const [{ s3: { bucket: { name }, object: { key }}}] = event.Records

  const params = { Bucket: name, Key: key }

  const result = await scheduleEcs(JSON.stringify(params), environment)

  return {
    statusCode: 200,
    body: JSON.stringify({
      result
    }, null, 2)
  }
}

module.exports = { hello }
