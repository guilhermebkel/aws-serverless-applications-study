function isLocal() {
	return process.env.IS_LOCAL || process.env.NODE_ENV === "development"
}

module.exports = isLocal()