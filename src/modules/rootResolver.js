import { GraphQLUpload } from "graphql-upload";
import {
  userMutations as UserMutations,
  userQueries as UserQueries,
} from "./user";
import { imagesMutations as ImagesMutations } from "./images";
import {
  sportsGroundMutations as SportsGroundMutations,
  sportsGroundQueries as SportsGroundQueries,
} from "./sportsGround";
import {
  reviewMutations as ReviewMutations,
  reviewQueries as ReviewQueries,
} from "./review";
import {
  trainerMutations as TrainerMutations,
  trainerQueries as TrainerQueries,
} from "./trainer";
import {
  sportTypesMutations as SportTypesMutatuions,
  sportTypesQueries as SportTypesQueries,
} from "./sportTypes";
import { lostPasswordQueries as LostPasswordQueries } from "./lostPassword";
import {
  eventsMutations as EventsMutations,
  eventsQueries as EventsQueries,
} from "./events";
import { reservationMutations as ReservationMutations } from "./reservation";
import {
  doEventsLogic,
  mapSportsGroundToDto,
  mapSportTypeToDto,
  mapTrainerToDto,
} from "./utils";
import { getReviews } from "./review/query";
import { getTrainerByUserId } from "./user/sql";
import { getSportsGroundsEvents, getTrainersEvents } from "./events/sql";

export default {
  Upload: GraphQLUpload,
  Query: {
    ...EventsQueries,
    ...ReviewQueries,
    ...UserQueries,
    ...SportsGroundQueries,
    ...SportTypesQueries,
    ...LostPasswordQueries,
    ...TrainerQueries,
  },
  Mutation: {
    ...EventsMutations,
    ...ReviewMutations,
    ...ImagesMutations,
    ...UserMutations,
    ...SportTypesMutatuions,
    ...SportsGroundMutations,
    ...TrainerMutations,
    ...ReservationMutations,
  },
  User: {
    async sportsGrounds(parent, _, { dbConnection }) {
      if (parent.accountType === "gym") {
        const sportsGrounds = await dbConnection.query(
          "select * from sports_ground where id in (select SPORTS_GROUND_ID from USER_HAS_SPORTS_GROUND where USER_ID = ?)",
          [parent.id]
        );

        return sportsGrounds.map(mapSportsGroundToDto);
      }
      return [];
    },
    async trainer(parent, _, { dbConnection }) {
      if (parent.accountType === "trainer") {
        const trainerDbResponse = await getTrainerByUserId(
          parent.id,
          dbConnection
        );
        return mapTrainerToDto(trainerDbResponse[0]);
      }
      return null;
    },
    async reviews(parent, _, { dbConnection }) {
      return await getReviews(
        _,
        { id: parent.id, accountType: "personal" },
        { dbConnection }
      );
    },
  },
  SportsGround: {
    async sportTypes(parent, _, { dbConnection }) {
      const sportTypes = await dbConnection.query(
        "select * from sport_type where id in (select Sport_type_id from SPORTS_GROUND_HAS_SPORT_TYPE where SPORTS_GROUND_ID = ?)",
        [parent.id]
      );
      return sportTypes.map(mapSportTypeToDto);
    },
    async reviews(parent, _, { dbConnection }) {
      return await getReviews(
        _,
        { id: parent.id, accountType: "gym" },
        { dbConnection }
      );
    },
    async events(parent, _, { dbConnection }) {
      const response = await getSportsGroundsEvents(parent.id, dbConnection);
      return await doEventsLogic(response, parent, dbConnection);
    },
  },
  Trainer: {
    async sportTypes(parent, _, { dbConnection }) {
      const sportTypes = await dbConnection.query(
        "select * from sport_type where id in (select Sport_type_id from TRAINER_HAS_SPORT_TYPE where TRAINER_ID = ?)",
        [parent.id]
      );
      return sportTypes.map(mapSportTypeToDto);
    },
    async reviews(parent, _, { dbConnection }) {
      return await getReviews(
        _,
        { id: parent.id, accountType: "trainer" },
        { dbConnection }
      );
    },
    async events(parent, _, { dbConnection }) {
      const response = await getTrainersEvents(parent.id, dbConnection);
      return await doEventsLogic(response, parent, dbConnection);
    },
  },
  Event: {
    async sportType(parent, _, { dbConnection }) {
      const sportType = await dbConnection.query(
        "select * from sport_type where id = ?",
        [parent.sportTypeId]
      );
      return mapSportTypeToDto(sportType[0]);
    },
  },
};
