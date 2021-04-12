// Import dependancies
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')

// Create a schema
const schema = buildSchema(`
type About {
  message: String!
  time: String!
}

type Meal {
  description: String!
}

enum MealTime {
  breakfast 
  lunch 
  dinner
}

interface listsPetsandFilms {
  name: String!
}

type Pet {
  name: String!
  species: String!
}

type Movie {
  name: String!
  genre: String! 
  rating: String!
}

enum genreMovie {
  Horror
  Musical 
  Drama 
  Documentary 
  Comedy
}

type Time {
  hour: String!
  minute: String!
  second: String!
}

type Random {
  number: String!
}

type Rolls {
  total: Int!
  sides: Int!
  rolls: Int!
}

type Query {
  getAbout: About
    getmeal(time: String!): Meal
  
  getPet(id: Int!): Pet 
  allPets: [Pet!]!
  firstPet: Pet
  lastPet: Pet
  
  getTime: Time

  getMovie(id: Int!): Movie
  allMovies: [Movie!]!

  getRandom(max: Int!): Random

  getRoll(sides: Int!, rolls: Int!): Rolls
}
`)

// Mock Pet datatbase:
const petList = [
	{ name: 'Fluffy', species: 'Dog' },
	{ name: 'Sassy', species: 'Cat' },
	{ name: 'Goldberg', species: 'Frog' }
]

// Mock Movie datatbase:
const movieList = [
	{ name: 'The Crow', genre: 'Horror', rating: '7/10' },
  { name: 'La Vie En Rose', genre: 'Musical', rating: '8/10' },
	{ name: 'The Basketball Diaries', genre: 'Drama', rating: '7/10' },
	{ name: 'Jodorowsky’s Dune', genre: 'Documentary', rating: '10/10' },
  { name: 'Death Becomes Her', genre: 'Comedy', rating: '6/10' }
]

// Define a resolver
const root = {
  getAbout: () => {
    return { 
      message: 'Hello World', 
      time: new Date().toString()
    }
  },
    getmeal: ({time}) => {
        const allMeals = { 
          breakfast: 'toast',
          lunch: 'noodles',
          dinner: 'pizza'
        }
        const meal = allMeals[time]
        return { description: meal }
    },
    getPet: ({ id }) => {
        return petList[id]
    },
    allPets: () => {
        return petList
    },
    firstPet: () => {
        return petList[0]
    },
    lastPet: () => {
      return petList[2]
    },
    getMovie: ({ id }) => {
      return movieList[id]
    },
    allMovies: () => {
      return movieList
    }, 
    getTime: () => {
      const d = new Date()
      return {
        hour: d.getHours().toString(),
        minute: d.getMinutes().toString(),
        second: d.getSeconds().toString()
      }
    },
    getRandom: ({ max }) => {
      return {
        number: Math.floor(Math.random() * max).toString()
      }
    },
    getRoll: ({sides, rolls}) => {
      return {
        total: Rolls.reduce((a, b) => a + b, 0),
        sides: sides,
        rolls: Rolls.push(rolls)
      }
    }
}

// Create an express app
const app = express()

// Define a route for GraphQL
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}))

// Start this app
const port = 4000
app.listen(port, () => {
  console.log(`Running on port: ${port}`)
})