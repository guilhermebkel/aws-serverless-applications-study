'use strict'

const { ApolloServer, gql } = require("apollo-server-lambda")

const setupDynamoDBClient = require("./src/core/util/setupDynamoDB")
setupDynamoDBClient()

const HeroFactory = require("./src/core/factories/heroFactory")
const SkillFactory = require("./src/core/factories/skillFactory")

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

exports.handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
});

exports.test = async function main() {
  const skillFactory = await SkillFactory.createInstance()
  const heroFactory = await HeroFactory.createInstance()

  const skillId = Date.now()

  await skillFactory.create({
    id: skillId,
    name: "Fire",
    value: 50 
  })

  const skillItem = await skillFactory.findOne(skillId)

  console.log(skillItem)

  const allSkills = await skillFactory.findAll()

  console.log(allSkills)

  console.log('----------\n\n')

  const heroId = Date.now()

  await heroFactory.create({
    id: heroId,
    name: "Batman",
    skills: [skillId]
  })

  const hero = await heroFactory.findOne(heroId)

  console.log(hero)

  const allHeroes = await heroFactory.findAll()

  console.log(allHeroes)

  return {
    statusCode: 200,
    body: JSON.stringify({
      skillItem, allSkills, hero, allHeroes
    }, null, 2)
  }
}
