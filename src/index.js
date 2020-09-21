// index.js
// This is the main entry point of our application

const express = require('express');
const {ApolloServer, gql} = require('apollo-server-express');

const Models = require('./models');

// import our .env configuration
require('dotenv').config();

// import db - mongoose
const db = require('./db');

// Run the server on a port specified in our .env file or port 4000
const port = process.env.PORT || 4000;
// Store the DB_HOST value as a variable
const DB_HOST = process.env.DB_HOST;



let notes = [
        { id: '1', content: 'Первая заметка', author: 'Байков Максим' },
        { id: '2', content: 'Вторая статья', author: 'Вася Пупкин' },
        { id: '3', content: 'Опа статья, гаршочек, не вари!', author: 'Джон Уик' }
    ];

// Construct a schema, using GraphQL schema language
const typeDefs = gql `
type Note {
        id: ID!
        content: String!
        author: String!
    }

type Query {
        hello: String
        notes: [Note!]!
        note(id: ID!): Note!
    }
type Mutation {
        newNote(content: String!): Note!
    }        
`;

// Provide resolver functions for our schema fields
const resolvers = {
    Query: {
        hello: () => 'Hello world!',
        notes: async () => {
            return await Models.Note.find();
        },
        note: (parent, args) => {
            return notes.find(note => note.id === args.id);
        }
    },

    Mutation: {
        newNote:async(parent,args) => {
            return await Models.Note.create({
                content : args.content,
                author: 'simonchik'
            });
        }
    }
};


const app = express();

// Connect to the database
db.connect(DB_HOST);

// Apollo Server setup
const server = new ApolloServer({ typeDefs, resolvers });

// Apply the Apollo GraphQL middleware and set the path to /api
server.applyMiddleware({ app, path: '/api' });
app.listen({port}, () => console.log(`GraphQL Server running at http://localhost:${port}${server.graphqlPath}`));