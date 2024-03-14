// graphql/schema.graphql.js

const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type File {
    filename: String!
    mimetype: String!
    encoding: String!
    url: String!
  }

  type Query {
    hello: String
  }

  type Mutation {
    uploadImage(file: Upload!): File!
  }
`;

module.exports = typeDefs;
