import { resolveUndefined } from "../utils";

export const getGymReviews = async (id, dbConnection) =>
  dbConnection.query("SELECT * FROM REVIEW WHERE SPORTS_GROUND_ID = (?)", [id]);

export const getTrainerReviews = async (id, dbConnection) =>
  dbConnection.query("SELECT * FROM REVIEW WHERE TRAINER_ID = (?)", [id]);

export const getUserReviews = async (id, dbConnection) =>
  dbConnection.query("SELECT * FROM REVIEW WHERE USER_ID = (?)", [id]);

export const postTrainerReview = async (trainerId, request, dbConnection) => {
  const { text, value } = request;
  return dbConnection.query(
    `INSERT INTO REVIEW (ID, TEXT, VALUE, TRAINER_ID) 
    VALUES (NULL, ?, ?, ?);`,
    [resolveUndefined(text), value, trainerId]
  );
};

export const postSportsGroundReview = async (
  sportsGroundId,
  request,
  dbConnection
) => {
  const { text, value } = request;
  return dbConnection.query(
    `INSERT INTO REVIEW (ID, TEXT, VALUE, SPORTS_GROUND_ID) 
    VALUES (NULL, ?, ?, ?);`,
    [resolveUndefined(text), value, sportsGroundId]
  );
};
