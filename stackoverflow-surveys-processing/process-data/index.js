const csvToJson = require("csvtojson")
const XLSXChart = require ("xlsx-chart")
const { createReadStream, promises: { readFile } } = require("fs")
const { Transform, Writable, pipeline } = require("stream")
const { promisify } = require("util")
const AWS = require("aws-sdk")
const assert = require("assert")

const pipelineAsync = promisify(pipeline)
const chart = new XLSXChart()
const S3 = new AWS.S3()

const processDataStream = (salaryTypes, finalData) => new Writable({
	write: (chunk, enconding, callback) => {
		const item = JSON.parse(chunk)

		console.log("Respondent", item.Respondent)

		if (item.SalaryTypes === "NA") {
			return callback()
		}

		finalData.titles.push(item.SalaryType)
		finalData.fields.push(item.Country)

		if (!salaryTypes[item.SalaryType]) {
			salaryTypes[item.SalaryType] = {}
		}

		if (!salaryTypes[item.SalaryType][item.Country]) {
			salaryTypes[item.SalaryType][item.Country] = 1

			return callback()
		}

		salaryTypes[item.SalaryType][item.Country] += 1

		return callback(null, item)
	}
})

const mapStream = elapsedBytes => new Transform({
	objectMode: true,
	transform: (chunk, encoding, callback) => {
		elapsedBytes.count += chunk.length

		const item = JSON.parse(chunk)

		const data = JSON.stringify({
			Country: item.Country,
			SalaryType: item.SalaryType,
			Respondent: item.Respondent
		})

		return callback(null, data)
	}
})

const generateFile = async (finalData, salaryTypes) => {
	const id = Date.now()

	const opts = {
		file: `chart-${id}.xlsx`,
		chart: "column",
		titles: [...new Set(finalData.titles)].sort(),
		fields: [...new Set(finalData.fields)].sort(),
		data: salaryTypes
	}

	const writeFileAsync = promisify(chart.writeFile.bind(chart))

	await writeFileAsync(opts)

	return {
		filename: opts.file
	}
}

const formatBytes = (bytes, decimals = 2) => {
	if (bytes === 0) {
		return "0 bytes"
	}

	const key = 1024

	const decimalsValue = decimals < 0 ? 0 : decimals

	const sizes = [
		"Bytes", "KB", "MB", "GB", "TB", "PB"
	]

	const unities = Math.floor(Math.log(bytes) / Math.log(key))

	return parseFloat((bytes / Math.pow(key, unities)).toFixed(decimalsValue)) + " " + sizes[unities]
}

async function main() {
	const reportsFolder = process.env.BUCKET_REPORTS
	assert.ok(reportsFolder, "env BUCKET_REPORTS is required!")

	const surveyFile = process.env.SURVEY_FILE
	assert.ok(surveyFile, "env SURVEY_FILE is required!")

	const data = JSON.parse(surveyFile)

	console.time("Elapsed time")

	const elapsedBytes = { count: 0 }
	const refSalaryTypes = {}
	const refFinalData = {
		fields: [],
		titles: []
	}

	// const fileStream = S3.getObject().createReadStream()
	const fileStream = createReadStream("../data/survey_results_public.csv")
	
	await pipelineAsync(
		fileStream,
		csvToJson(),
		mapStream(elapsedBytes),
		processDataStream(refSalaryTypes, refFinalData)
	)

	console.log("Elapsed bytes", formatBytes(elapsedBytes.count))

	const { filename } = await generateFile(refFinalData, refSalaryTypes)
	console.log("Filename: ", filename)

	const s3Response = await S3.putObject({
		Body: await readFile(filename),
		Key: filename,
		Bucket: `${data.Bucket}/${reportsFolder}`
	}).promise()
	console.log("S3 Response: ", s3Response)

	console.timeEnd("Elapsed time")
}

process.env.SURVEY_FILE = JSON.stringify({
	Bucket: "gbkel-serverless-01",
	Key: "survey_results_public.csv"
})

process.env.BUCKET_REPORTS = "reports"

main()