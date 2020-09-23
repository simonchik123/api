const express = require('express');
const { ApolloServer } = require('apollo-server-express');
// import our .env configuration
require('dotenv').config();


// ===================================
// Импорт локальных модулей

// import db - mongoose
const db = require('./db');
const Models = require('./models');
// Import a schema, using GraphQL schema language
const typeDefs = require('./sсhema');
// Provide resolver functions for our schema fields
const resolvers = require('./resolvers');
//=====================================


//=====================================
// Run the server on a port specified in our .env file or port 4000
const port = process.env.PORT || 4000;
// Store the DB_HOST value as a variable
const DB_HOST = process.env.DB_HOST;
//=====================================


const app = express();

// Connect to the database
db.connect(DB_HOST);

// Apollo Server setup
const server = new ApolloServer({
    typeDefs,
    resolvers,
    // Add the db models to the context
    context: () => {
        return {
            Models
        };
    }
});

// Apply the Apollo GraphQL middleware and set the path to /api
server.applyMiddleware({app,path: '/api'});
app.listen({port}, () => console.log(`GraphQL Server running at http://localhost:${port}${server.graphqlPath}`));