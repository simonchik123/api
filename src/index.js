const express = require('express');
const { ApolloServer } = require('apollo-server-express');
// import our .env configuration
require('dotenv').config();

// import jwt module (token)
const jwt = require('jsonwebtoken');
const depthLimit = require('graphql-depth-limit');
const { createComplexityLimitRule } = require('graphql-validation-complexity');

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
    validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
    // Add the db models to the context
    context: async ({ req }) => {
        // get the user token from the headers
        const token = req.headers.authorization;
        // try to retrieve a user with the token
        const user = await getUser(token);
        // for now, let's log the user to the console:
        console.log(user);
        // add the db models and the user to the context
        return { Models, user };
    }
});

// get the user info from a JWT
const getUser = token => {
    if (token) {
        try {
            // return the user information from the token
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            // if there's a problem with the token, throw an error
            throw new Error('Session invalid');
        }
    }
};

// Apply the Apollo GraphQL middleware and set the path to /api
server.applyMiddleware({app,path: '/api'});
app.listen({port}, () => console.log(`GraphQL Server running at http://localhost:${port}${server.graphqlPath}`));