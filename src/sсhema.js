const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language

/* 
    scalar DateTime

    createdAt: DateTime!
    updatedAt: DateTime! */
module.exports = gql `

type Note {
        id: ID!
        content: String!
        author: User!        
    }
type User {
        id: ID!
        username: String!
        email: String!
        avatar: String
        notes: [Note!]!
    }

type Query {
        hello: String
        notes: [Note!]!
        note(id: ID!): Note!
        user(username: String!): User
        users: [User!]!
        me: User!
    }
type Mutation {
        newNote(content: String!): Note!
        updateNote(id: ID!, content: String!): Note!
        deleteNote(id: ID!): Boolean!
        signUp(username: String!, email: String!, password: String!): String!
        signIn(username: String, email: String, password: String!): String!
    }      
`;