const mailComposer = require("mailcomposer")
const AWS = require("aws-sdk")
const { promises: { writeFile, unlink } } = require("fs")
const { promisify } = require("util")

const S3 = new AWS.S3()
const SES = new AWS.SES({
	region: "us-east-1"
})


const handler = async event => {
	const [{ s3: { bucket: { name }, object: { key }}}] = event.Records

	const params = { Bucket: name, Key: key }
	
	const { Body: file } = await S3.getObject(params).promise()

	const pathName = `/tmp/${Date.now()}-${key.replace("/", "")}`

	await writeFile(pathName, file)

	const data = {
		to: process.env.SES_EMAIL_TO,
		from: process.env.SES_EMAIL_FROM,
		subject: "Report Generated"
	}

	const mail = mailComposer({
		...data,
		text: "Body message!!",
		attachments: [{
			path: pathName
		}]
	})

	const message = await promisify(mail.build.bind(mail))()

	const response = await SES.sendRawEmail({
		RawMessage: { Data: message }
	}).promise()

	await unlink(pathName)

	return {
		statusCode: 200,
		body: JSON.stringify({
			response
		}, null, 2)
	}
}

module.exports = {
	hello: handler
}
