const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

;(async () => {
	console.log("Starting...", new Date().toISOString())

	await sleep(2000)

	console.log("Finishing...", new Date().toISOString())
})()