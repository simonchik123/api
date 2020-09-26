const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language

/* createdAt: DateTime!
    updatedAt: DateTime! */
module.exports = gql `

scalar DateTime

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
        updateNote(id: ID!, content: String!): Note!
        deleteNote(id: ID!): Boolean!
    }        
`;