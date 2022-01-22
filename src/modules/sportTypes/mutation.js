import { updateSportsGroundSportTypes } from "../sportsGround/sql";
import { updateTrainerSportTypes } from "../trainer/sql";

export const updateSportTypes = async (
  _,
  { id, sportType, accountType, isDelete },
  { dbConnection }
) => {
  if (accountType === "gym") {
    await updateSportsGroundSportTypes(
      id,
      sportType.id,
      isDelete,
      dbConnection
    );
  } else if (accountType === "trainer") {
    await updateTrainerSportTypes(id, sportType.id, isDelete, dbConnection);
  }
  return sportType;
};
