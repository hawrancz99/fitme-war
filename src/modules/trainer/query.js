import { mapTrainerToDto } from "../utils";

export const trainer = async (_, { id, userId }, { dbConnection }) => {
  const dbTrainer = (
    await dbConnection.query("SELECT * FROM TRAINER WHERE ID = ?", [id])
  )[0];
  if (!dbTrainer) {
    return null;
  }
  return { ...mapTrainerToDto(dbTrainer), reqParams: { userId } };
};
