import { mapSportTypeToDto } from "../utils";
import { getSportTypes } from "./sql";

// eslint-disable-next-line import/prefer-default-export
export const sportTypes = async (_, __, { dbConnection }) => {
  const dbSportTypes = await getSportTypes(dbConnection);
  return dbSportTypes.map((s) => mapSportTypeToDto(s));
};
