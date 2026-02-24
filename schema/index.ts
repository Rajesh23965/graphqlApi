import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User {
    id: ID!
    name: String
    email: String!
    username: String
    profile_picture: String
    created_at: String
    updated_at: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    users(page: Int, limit: Int): [User!]!
    user(id: ID!): User
    searchUsers(search: String!): [User!]!
    me: User
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    updateProfile(input: UpdateProfileInput!): User!
    changePassword(input: ChangePasswordInput!): Boolean!
    uploadProfilePicture(file: Upload!): User!
    forgotPassword(email: String!): Boolean!
    resetPassword(input: ResetPasswordInput!): Boolean!
    logout: Boolean!
  }

  input RegisterInput {
    name: String
    email: String!
    username: String
    password: String!
  }

  input UpdateProfileInput {
    name: String
    email: String
    username: String
  }

  input ChangePasswordInput {
    oldPassword: String!
    newPassword: String!
  }

  input ResetPasswordInput {
    token: String!
    password: String!
  }

  scalar Upload
`;