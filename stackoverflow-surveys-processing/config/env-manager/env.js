const ssmPrefix = "/prod/process-data"

const variables = {
	ECS_TASK_DEFINITION: {
		value: "process-data:1",
		type: "String"
	},
	ECS_CLUSTER_NAME: {
		value: "data-processing",
		type: "String"
	},
	ECS_TASK_LAUNCH_TYPE: {
		value: "FARGATE",
		type: "String"
	},
	ECS_TASK_COUNT: {
		value: "1",
		type: "String"
	},
	ECS_TASK_PLATFORM_VERSION: {
		value: "LATEST",
		type: "String"
	},
	ECS_TASK_CONTAINER_NAME: {
		value: "process-data",
		type: "String"
	},
	ECS_TASK_CONTAINER_FILE_ENV: {
		value: "SURVEY_FILE",
		type: "String"
	},
	ECS_TASK_SUBNETS: {
		value: [
			"subnet-5e331139",
			"subnet-573ade59",
			"subnet-67af803b",
			"subnet-29ec9a17",
			"subnet-6f19eb22",
			"subnet-94d0f9ba"
		].join(","),
		type: "StringList"
	},
	ECS_TASK_SECURITY_GROUPS: {
		value: [
			"sg-0b96ac7211d827c74"
		].join(","),
		type: "StringList"
	},
	ECS_TASK_ASSIGN_PUBLIC_IP: {
		value: "ENABLED",
		type: "String"
	},
	ECS_PROCESS_DATA_IMAGE_URL: {
		value: "472767929985.dkr.ecr.us-east-1.amazonaws.com/stackoverflow-surveys-processing",
		type: "String"
	},
	BUCKET_REPORTS: {
		value: "reports",
		type: "String"
	},
	LOG_GROUP_NAME: {
		value: "/ecs/process-data",
		type: "String"
	},
	SSM_PREFIX: {
		value: ssmPrefix,
		type: "String"
	},
	BUCKET_SURVEYS: {
		value: "gbkel-serverless-01",
		type: "String"
	},
	REGION: {
		value: "us-east-1",
		type: "String"
	},
	SES_EMAIL_TO: {
		value: "guilhermebromonschenkel@gmail.com",
		type: "String"
	},
	SES_EMAIL_FROM: {
		value: "guilhermebromonschenkel@gmail.com",
		type: "String"
	}
}

module.exports = {
	variables,
	ssmPrefix
}