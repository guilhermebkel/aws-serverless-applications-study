'use strict'

const { ApolloServer } = require("apollo-server-lambda")

const setupDynamoDBClient = require("./src/core/util/setupDynamoDB")
setupDynamoDBClient()

const HeroFactory = require("./src/core/factories/heroFactory")
const SkillFactory = require("./src/core/factories/skillFactory")

const isLocal = require("./src/core/util/isLocal")

const schema = require("./src/graphql")

const server = new ApolloServer({
  schema,
  context: async () => ({
    Hero: await HeroFactory.createInstance(),
    Skill: await SkillFactory.createInstance()
  }),
  introspection: isLocal,
  playground: isLocal,
  formatError(error) {
    console.error("[GLOBAL ERROR LOGGER] ", error)
    return error
  },
  formatResponse(response) {
    console.error("[GLOBAL RESPONSE LOGGER] ", response)
    return response
  }
});

exports.handler = server.createHandler({
  cors: {
    origin: "*"
  }
})

// exports.test = async function main() {
//   const skillFactory = await SkillFactory.createInstance()
//   const heroFactory = await HeroFactory.createInstance()

//   const skillId = Date.now()

//   await skillFactory.create({
//     id: skillId,
//     name: "Fire",
//     value: 50 
//   })

//   const skillItem = await skillFactory.findOne(skillId)

//   console.log(skillItem)

//   const allSkills = await skillFactory.findAll()

//   console.log(allSkills)

//   console.log('----------\n\n')

//   const heroId = Date.now()

//   await heroFactory.create({
//     id: heroId,
//     name: "Batman",
//     skills: [skillId]
//   })

//   const hero = await heroFactory.findOne(heroId)

//   console.log(hero)

//   const allHeroes = await heroFactory.findAll()

//   console.log(allHeroes)

//   return {
//     statusCode: 200,
//     body: JSON.stringify({
//       skillItem, allSkills, hero, allHeroes
//     }, null, 2)
//   }
// }
