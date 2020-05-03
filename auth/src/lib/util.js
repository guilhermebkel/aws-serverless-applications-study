const buildIAMPolicy = (userId, effect, resource, context) => {
	const policy = {
		principalId: userId,
		policyDocument: {
			Statement: [{
				Action: "execute-api:Invoke",
				Effect: effect,
				Resource: resource
			}]
		},
		context
	}

	return policy
}

module.exports = {
	buildIAMPolicy
}