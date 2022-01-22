import { mapUserToDto } from "../utils";
import { updateSportsGround } from "./sql";
import { checkExistingUser, getUserByEmail, updateUserDb } from "../user/sql";
import { createToken } from "../../libs/token";

export const updateGym = async (_, { sportsGround }, { dbConnection }) => {
  const { originEmail, email, token } = sportsGround; //on je to typ sportsGroundRequest
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

  await updateSportsGround(sportsGround, dbConnection);

  return {
    user: mapUserToDto({ ...originUser[0], email: email }),
    token: finalToken,
  }; //user na sobě má gym, kvůli změně mailu musíme vyměnit token a vrátit usera, aby se šlo přihlásit
};
