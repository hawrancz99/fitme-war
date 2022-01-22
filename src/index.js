import dotenv from "dotenv-flow";
import express from "express";
import cors from "cors";
import { ApolloServer, gql } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { graphqlUploadExpress } from "graphql-upload";
import { getConnection } from "./libs/connection";
import rootResolver from "./modules/rootResolver";
import path from "path";

const google = require("googleapis");
const gAuth = require("google-auth-library");
dotenv.config();

const typeDefs = gql`
  type User {
    id: Int!
    firstName: String
    lastName: String
    email: String!
    phoneNumber: String
    accountType: String
    reviews: [Review!]!
    sportsGrounds: [SportsGround!]!
    trainer: Trainer
  }

  type Trainer {
    id: Int!
    firstName: String!
    lastName: String!
    email: String!
    street: String
    descNumber: String
    city: String
    zip: Int
    phoneNumber: String
    website: String
    facebook: String
    about: String
    instagram: String
    images: [String!]
    sportTypes: [SportType!]
    reviews: [Review!]
    events: [Event!]!
    fullAddress: String
    distanceFromUser: Float
  }

  type Void {
    void: String
  }

  type SportType {
    id: Int!
    name: String!
    varName: String!
  }

  type Review {
    id: Int!
    value: Int!
    text: String
  }

  input ReviewRequest {
    id: Int
    value: Int!
    text: String
  }

  type SportsGround {
    id: Int!
    name: String
    street: String
    registrationNumber: Int
    descNumber: String
    city: String
    zip: Int
    website: String
    facebook: String
    about: String
    instagram: String
    images: [String!]
    email: String
    phoneNumber: String
    fullAddress: String
    distanceFromUser: Float
    sportTypes: [SportType!]
    reviews: [Review!]
    events: [Event!]!
  }

  input SportsGroundRequest {
    id: Int!
    fullAddress: String!
    name: String
    street: String
    registrationNumber: Int
    descNumber: String
    city: String
    zip: Int
    website: String
    facebook: String
    about: String
    instagram: String
    images: [String!]!
    email: String
    phoneNumber: String
    originEmail: String!
    distanceFromUser: Float
    events: [EventRequest!]!
    token: String!
  }

  input TrainerRequest {
    id: Int!
    firstName: String!
    lastName: String!
    email: String!
    street: String
    descNumber: String
    city: String
    zip: Int
    phoneNumber: String
    website: String
    facebook: String
    about: String
    instagram: String
    originEmail: String!
    token: String!
    events: [EventRequest!]!
    distanceFromUser: Float
    fullAddress: String
  }

  type Event {
    id: Int!
    dateFrom: String!
    dateTo: String!
    name: String!
    fullAddress: String!
    about: String
    price: Float!
    capacity: Int!
    sportsGroundId: Int
    trainerId: Int
    sportType: SportType!
    userLogged: Boolean
    totalUsersLogged: Int
    distanceFromUser: Float
  }

  input EventRequest {
    id: Int
    dateFrom: String!
    dateTo: String!
    name: String!
    fullAddress: String!
    about: String
    capacity: Int!
    price: Float!
    sportsGroundId: Int
    trainerId: Int
    distanceFromUser: Float
    totalUsersLogged: Int
    userLogged: Boolean
    sportType: SportTypeForInput!
  }

  input UserRequest {
    id: Int!
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String
    accountType: String!
    token: String!
    reviews: [ReviewRequest!]
    emailChanged: Boolean!
  }

  type FilterResponse {
    sportsGrounds: [SportsGround]
    trainers: [Trainer]
    events: [Event]
  }

  type Query {
    user(email: String!): User
    users: [User!]!
    void: Void!
    filter(filterRequest: FilterRequest!): FilterResponse!
    sportsGroundsBySportTypes(
      sportTypesInput: [SportTypeForInput!]!
    ): [SportsGround!]!
    sportTypes: [SportType!]!
    sportsGround(id: Int!, userId: Int): SportsGround!
    trainer(id: Int!, userId: Int): Trainer!
    lostPassword(userEmail: String!): String
    checkTokenValidity(token: String!): Boolean
    getReviews(id: Int!, accountType: String!): [Review!]!
    getEvents(userId: Int!, accountType: String!): [Event!]!
    getEventsForUser(userId: Int!): [Event!]!
  }

  type AuthInfo {
    user: User!
    token: String!
  }

  input RegistrationRequest {
    registrationNumber: Int
    email: String!
    password: String!
    firstName: String
    lastName: String
    phoneNumber: String
    name: String
    street: String
    descNumber: String
    city: String
    zip: Int
    accountType: String
  }

  input SportTypeForInput {
    id: Int!
    name: String!
    varName: String!
  }

  input FilterRequest {
    location: String!
    sportTypes: [SportTypeForInput!]
    filterBy: String!
  }

  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
    link: String!
  }

  type Mutation {
    changePassword(
      oldPassword: String!
      newPassword: String!
      token: String!
    ): Void!
    changeLostPassword(newPassword: String!, token: String!): Boolean
    login(email: String, password: String, token: String): AuthInfo!
    registration(input: RegistrationRequest!): AuthInfo!
    updateGym(sportsGround: SportsGroundRequest!): AuthInfo!
    updateTrainer(trainerRequest: TrainerRequest!): AuthInfo!
    updateUser(userRequest: UserRequest!): AuthInfo!
    updateSportTypes(
      id: Int!
      sportType: SportTypeForInput!
      isDelete: Boolean!
      accountType: String!
    ): SportType!
    singleUpload(file: Upload!, id: Int!, accountType: String!): File!
    deletePhoto(id: Int!, link: String!, accountType: String!): String!
    postReview(
      reviewRequest: ReviewRequest!
      id: Int!
      accountType: String!
    ): Review!
    addEvent(eventRequest: EventRequest!): Event!
    deleteEvents(ids: [Int!]!): Boolean
    updateEvent(eventRequest: EventRequest!): Event!
    createReservation(userId: Int!, eventId: Int!): Boolean
    deleteReservation(userId: Int!, eventId: Int!): Boolean
  }
`;

const main = async () => {
  const app = express();

  app.disable("x-powered-by");
  app.use(cors());
  app.use(graphqlUploadExpress());
  let dbConnection = null;
  let driveService = null;

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers: rootResolver,
    context: async ({ req, res }) => {
      if (!dbConnection) {
        dbConnection = await getConnection();
      }
      const auth = req.headers.Authorization || "";
      let correctedPath = path.join(__dirname, "images", "googleSecret.json");

      if (!driveService) {
        const googleAuth = await new gAuth.GoogleAuth({
          keyFile: correctedPath,
          scopes: ["https://www.googleapis.com/auth/drive"],
        });
        driveService = await new google.drive_v3.Drive({ auth: googleAuth });
      }
      return {
        req,
        res,
        dbConnection,
        auth,
        driveService,
      };
    },
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app, cors: false });

  const port = process.env.PORT || 4000;

  app.get("/", (_, res) => res.redirect("/graphql"));

  app.listen(port, () => {
    console.info(`Server started at http://localhost:${port}/graphql`);
  });
};

main();
