import { checkExistingUser, getUserByEmail, updateUserDb } from "../user/sql";
import { mapUserToDto } from "../utils";
import { createToken } from "../../libs/token";
import { updateTrainerDb } from "./sql";

export const updateTrainer = async (
  _,
  { trainerRequest },
  { dbConnection }
) => {
  const { originEmail, email, token } = trainerRequest;
  let originUser = await getUserByEmail(originEmail, dbConnection);
  let finalToken = token;
  if (originEmail !== email) {
    await checkExistingUser(email, dbConnection);
    originUser = mapUserToDto(originUser[0]);
    originUser = await updateUserDb(
      { ...originUser, email: email },
      dbConnection
    );
    finalToken = createToken({ email: email });
  }

  const trainer = await updateTrainerDb(trainerRequest, dbConnection);

  return {
    user: mapUserToDto({ ...originUser[0], email: email }, trainer[0]),
    token: finalToken,
  }; //user na sobě má gym, kvůli změně mailu musíme vyměnit token a vrátit usera, aby se šlo přihlásit
};
