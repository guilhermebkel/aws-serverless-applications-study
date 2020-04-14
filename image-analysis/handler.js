'use strict'

// const { promises: { readFile }} = require("fs")
const { get } = require("axios")

class Handler {
  constructor({ RecognitionService, TranslationService }) {
    this.RecognitionService = RecognitionService
    this.TranslationService = TranslationService
  }

  async detectImageLabels(buffer) {
    const result = await this.RecognitionService.detectLabels({
      Image: {
        Bytes: buffer
      }
    }).promise()

    const workingItems = result.Labels.filter(({ Confidence }) => Confidence > 80)

    const names = workingItems.map(({ Name }) => Name).join(" and ")

    return {
      names,
      workingItems
    }
  }

  async translateText(text) {
    const params = {
      SourceCodeLanguage: "en",
      TargetLanguageCode: "pt",
      Text: text
    }

    const { TranslatedText } = await this.TranslationService.translateText(params).promise()

    return TranslatedText.split(" e ")
  }

  formatTextResults(texts, workingItems) {
    const finalText = []

    for (const textIndex in texts) {
      const nameInPortuguese = texts[textIndex]
      const confidence = workingItems[textIndex].Confidence
      
      finalText.push(
        ` ${confidence.toFixed(2)}% de ser do tipo ${nameInPortuguese}`
      )
    }

    return finalText.join("\n")
  }

  async getImageBuffer(imageUrl) {
    const response = await get(imageUrl, {
      responseType: "arraybuffer"
    })

    const buffer = Buffer.from(response.data, "base64")

    return buffer
  }

  async main(event) {
    try {
      // const imageBuffer = await readFile("./images/cat.png")

      const { imageUrl } = event.queryStringParameters

      const imageBuffer = await this.getImageBuffer(imageUrl)

      const { names, workingItems } = await this.detectImageLabels(imageBuffer)

      const texts = await this.translateText(names)

      const finalText = this.formatTextResults(texts, workingItems)
       
      return {
        statusCode: 200,
        body: `A imagem tem\n `.concat(finalText)
      }
    } catch (error) {
      console.error(error)

      return {
        statusCode: 500,
        body: "Internal server error"
      }
    }
  }
}

const aws = require("aws-sdk")
const reko = new aws.Rekognition()
const translate = new aws.Translate()

const handler = new Handler({
  RecognitionService: reko,
  TranslationService: translate
})

module.exports.main = handler.main.bind(handler)
