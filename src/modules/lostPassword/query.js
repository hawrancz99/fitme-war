import { v4 as uuidv4 } from "uuid";
import {
  createNewToken,
  findByToken,
  invalidateToken,
} from "./lostPasswordDao";
import { sendMail } from "../../libs/email/email";

export const lostPassword = async (_, { userEmail }, { req, dbConnection }) => {
  const user = (
    await dbConnection.query("SELECT * FROM user WHERE EMAIL = ?", [userEmail])
  )[0];

  if (!user || !user.ID) {
    throw new Error("Unable to send mail");
  }
  const hash = uuidv4();

  await createNewToken(user.ID, hash, dbConnection);

  const link = `${req.headers.origin}/pwHash?t=${hash}`;

  await sendMail(user.EMAIL, "lostPassword", null, null, null, { link });
  return "";
};

export const checkTokenValidity = async (_, { token }, { dbConnection }) => {
  const dbVal = await findByToken(token, dbConnection);

  if (Date.now() - dbVal[0].CREATED_AT < 3600000) {
    return true;
  }
  if (!dbVal[0].COMPLETED_AT) {
    // INVALIDATE TOKEN
    await invalidateToken(token, dbConnection);
    return false;
  }
  return false;
};
