import { mapReviewToDto } from "../utils";
import { getGymReviews, getTrainerReviews, getUserReviews } from "./sql";

export const getReviews = async (_, { id, accountType }, { dbConnection }) => {
  let dbResponse = [];
  if (accountType === "gym") {
    dbResponse = await getGymReviews(id, dbConnection);
  } else if (accountType === "trainer") {
    dbResponse = await getTrainerReviews(id, dbConnection);
  } else {
    dbResponse = await getUserReviews(id, dbConnection);
  }

  return dbResponse.map(mapReviewToDto);
};
