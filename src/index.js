// index.js
// This is the main entry point of our application

const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const {ApolloServer, gql} = require('apollo-server-express');



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
        hello: String!
        notes: [Note!]!
        note(id : ID!) : Note !
        }
`;

// Provide resolver functions for our schema fields
const resolvers = {
    Query: {
        hello: () => 'Hello world!',
        notes: () => notes,
        note : (parent,args)=>{
            return notes.find(note => note.id == args.id)
            }
        }
    };

// Apollo Server setup
const server = new ApolloServer({ typeDefs, resolvers });

// Apply the Apollo GraphQL middleware and set the path to /api
server.applyMiddleware({ app, path: '/api' });

app.get('/', (req, res) => res.send('Hello World!!! HI'));
app.listen({port}, () => console.log(`GraphQL Server running at http://localhost:${port}${server.graphqlPath}`));