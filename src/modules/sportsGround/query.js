import {
  filterGoogleResults,
  getGoogleDistanceApi,
} from "../../libs/distance/googleDistanceApi";
import { mapEventToDto, mapSportsGroundToDto, mapTrainerToDto } from "../utils";
import { getSportsGrounds, getSportsGroundsBySportTypes } from "./sql";
import { getTrainers, getTrainersBySportTypes } from "../trainer/sql";
import { getAllEvents, getEventsBySportTypes } from "../events/sql";

const getGymsOrTrainersOrEvents = async (
  sportTypes,
  filterBy,
  dbConnection
) => {
  let result;
  if (sportTypes && sportTypes.length > 0) {
    result =
      filterBy === "sportsGrounds"
        ? await getSportsGroundsBySportTypes(sportTypes, dbConnection)
        : filterBy === "trainers"
        ? await getTrainersBySportTypes(sportTypes, dbConnection)
        : await getEventsBySportTypes(sportTypes, dbConnection);
  } else {
    result =
      filterBy === "sportsGrounds"
        ? await getSportsGrounds(dbConnection)
        : filterBy === "trainers"
        ? await getTrainers(dbConnection)
        : await getAllEvents(dbConnection);
  }
  return result;
};

export const filter = async (_, { filterRequest }, { dbConnection }) => {
  const { sportTypes, location, filterBy } = { ...filterRequest };
  const response = { trainers: [], sportsGrounds: [], events: [] };
  let gymsOrTrainersOrEventsToFilter = await getGymsOrTrainersOrEvents(
    sportTypes,
    filterBy,
    dbConnection
  );

  if (
    !gymsOrTrainersOrEventsToFilter ||
    gymsOrTrainersOrEventsToFilter.length < 1
  ) {
    return response;
  }

  let possibleResults = gymsOrTrainersOrEventsToFilter.map(
    filterBy === "sportsGrounds"
      ? mapSportsGroundToDto
      : filterBy === "trainers"
      ? mapTrainerToDto
      : mapEventToDto
  );
  const destinations = possibleResults.map((r) => r.fullAddress);
  const locationRequest = [location];

  const googleApiResult = await getGoogleDistanceApi(
    locationRequest,
    destinations
  );

  possibleResults = await filterGoogleResults(
    googleApiResult,
    destinations,
    possibleResults
  );

  return { ...response, [filterBy]: possibleResults };
};

export const sportsGroundsBySportTypes = async (
  _,
  { sportTypesInput },
  { dbConnection }
) => {
  const sportsGrounds = await getSportsGroundsBySportTypes(
    sportTypesInput,
    dbConnection
  );
  return sportsGrounds.map(mapSportsGroundToDto);
};

export const sportsGround = async (_, { id, userId }, { dbConnection }) => {
  const dbSportsGround = (
    await dbConnection.query("SELECT * FROM SPORTS_GROUND WHERE id = ?", [id])
  )[0];
  if (!dbSportsGround) {
    return null;
  }
  return { ...mapSportsGroundToDto(dbSportsGround), reqParams: { userId } };
};
