import { postSportsGroundReview, postTrainerReview } from "./sql";

export const postReview = async (
  _,
  { id, reviewRequest, accountType },
  { dbConnection }
) => {
  const insertedReview =
    accountType === "trainer"
      ? await postTrainerReview(id, reviewRequest, dbConnection)
      : await postSportsGroundReview(id, reviewRequest, dbConnection);
  return { ...reviewRequest, id: insertedReview.insertId };
};
