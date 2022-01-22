import { mapUserToDto } from "../utils";
import { getUserByEmail } from "./sql";

export const user = async (_, { email }, { dbConnection }) => {
  const dbUser = await getUserByEmail(email, dbConnection);
  if (!dbUser[0]) {
    return null;
  }
  return mapUserToDto(dbUser);
};
