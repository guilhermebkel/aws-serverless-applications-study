'use strict'

const { exec } = require("child_process")
const { promisify } = require("util")
const Joi = require("@hapi/joi")
const axios = require("axios")
const { promises: { writeFile, readFile, unlink } } = require("fs")

const shell = promisify(exec)

const decoratorValidator = require("./util/decoratorValidator")
const globalEnum = require("./util/globalEnum")

class Handler {
  static get name() {
    return "[MemeMaker]"
  }

  static get validator() {
    return Joi.object({
      image: Joi.string().uri().required(),
      topText: Joi.string().max(200).required(),
      bottomText: Joi.string().max(200) .optional()
    })
  }

  static generateImagePath() {
    const isLocal = process.env.IS_LOCAL

    return `${isLocal ? __dirname : "/tmp/"}${Date.now()}--out.png`
  }

  static async saveImageLocally(imageUrl, imagePath) {
    const { data } = await axios.get(imageUrl, {
      responseType: "arraybuffer"
    })

    const buffer = Buffer.from(data, "base64")

    return await writeFile(imagePath, buffer)
  }

  static generateIdentityCommand(imagePath) {
    const value = `
      gm identify \
      -verbose \
      ${imagePath}
    `

    const cmd = value.split("\n").join(" ")

    return cmd
  }

  static async getImageSize(imagePath) {
    const command = Handler.generateIdentityCommand(imagePath)

    const { stdout } = await shell(command)

    const [line] = stdout.trim().split("\n").filter(text => ~text.indexOf("Geometry"))

    const [width, height] = line.trim().replace("Geometry: ", "").split("x")

    return {
      width: +width,
      height: +height
    }
  }

  static setParameters(options, dimensions, imagePath) {
    return {
      topText: options.topText,
      bottomText: options.bottomText || "",
      font: __dirname + "/resources/impact.ttf",
      fontSize: dimensions.width / 8,
      fontFill: "#FFF",
      textPos: "center",
      strokeColor: "#000",
      strokeWeight: 1,
      padding: 40,
      imagePath
    }
  }

  static setTextPosition(dimensions, padding) {
    const top = Math.abs((dimensions.height / 2.1) - padding) * -1
    const bottom = (dimensions.height / 2.1) - padding

    return {
      top,
      bottom
    }
  }

  static generateConvertCommand(options, finalPath) {
    const value = `
      gm convert
      '${options.imagePath}'
      -font '${options.font}'
      -pointsize ${options.fontSize}
      -fill '${options.fontFill}'
      -stroke '${options.strokeColor}'
      -strokewidth ${options.strokeWeight}
      -draw 'gravity ${options.textPos} text 0,${options.top}  "${options.topText}"'
      -draw 'gravity ${options.textPos} text 0,${options.bottom}  "${options.bottomText}"'
      ${finalPath}
    `

    const cmd = value.split("\n").join(" ")

    return cmd
  }

  static async generateBase64EncodedImage(imagePath) {
    return await readFile(imagePath, "base64")
  }

  static async main(event) {
     try {
      const options = event.queryStringParameters

      console.log(`${Handler.name} Downloading image... ${options.image}`)

      const imagePath = Handler.generateImagePath()

      await Handler.saveImageLocally(options.image, imagePath)

      console.log(`${Handler.name} Downloaded image! ${imagePath}`)

      console.log(`${Handler.name} Retrieving image size...`)

      const dimensions = await Handler.getImageSize(imagePath)

      console.log(`${Handler.name} Preparing edit params...`)

      const params = Handler.setParameters(options, dimensions, imagePath)

      const { top, bottom } = Handler.setTextPosition(dimensions, params.padding)

      const finalPath = Handler.generateImagePath()

      const generateMemeCommand = Handler.generateConvertCommand({
        ...params,
        top,
        bottom
      }, finalPath)

      console.log(`${Handler.name} Generating meme image...`)

      await shell(generateMemeCommand)

      console.log(`${Handler.name} Generated meme image! ${finalPath}`)

      console.log(`${Handler.name} Finishing...`)

      const base64EncodedImage = await Handler.generateBase64EncodedImage(finalPath)

      await Promise.all([
        unlink(imagePath),
        unlink(finalPath)
      ])

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "text/html"
        },
        body: `<img src="data:image/jpeg;base64,${base64EncodedImage}"></img>`
      }
    } catch(error) {
      console.error(error.stack)
      return {
        statusCode: 500,
        body: "Internal server error"
      }
    }
  }
}

module.exports = {
  mememaker: decoratorValidator(
    Handler.main,
    Handler.validator,
    globalEnum.ARG_TYPE.QUERYSTRING
  )
}