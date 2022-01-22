import * as argon2 from "argon2";
import { createToken, getUserEmailFromToken } from "../../libs/token";
import { mapUserToDto } from "../utils";
import {
  checkExistingUser,
  createTrainer,
  createUser,
  findUserById,
  getUserByEmail,
  insertIntoUserGym,
  updatePassword,
  updateUserDb,
} from "./sql";
import { sendMail } from "../../libs/email/email";
import { createGym } from "../sportsGround/sql";
import { findByToken, invalidateToken } from "../lostPassword/lostPasswordDao";

export const login = async (
  _,
  { email, password, token },
  { dbConnection }
) => {
  if (token) {
    const decodedUserId = getUserEmailFromToken(token);
    email = decodedUserId.email;
  }
  const dbResponse = await getUserByEmail(email, dbConnection);
  const user = dbResponse[0];

  if (!user) {
    throw new Error("Uživatel neexistuje");
  }

  const passwordResult = password
    ? await argon2.verify(user.PASSWORD, password)
    : true;
  if (!passwordResult) {
    throw new Error("Nesprávná kombinace přihlašovacích údajů");
  }
  token = token ? token : createToken({ email: user.EMAIL });
  return {
    user: mapUserToDto(user),
    token,
  };
};

export const registration = async (_, { input }, { dbConnection }) => {
  const { accountType, email, name } = { ...input };

  await checkExistingUser(email, dbConnection);

  let createdUser;
  if (accountType === "gym") {
    createdUser = await createUser(
      { ...input, phoneNumber: null },
      dbConnection
    );
    const createdGym = await createGym(input, dbConnection);
    await insertIntoUserGym(
      createdUser.insertId,
      createdGym.insertId,
      dbConnection
    );
  }

  if (accountType === "trainer") {
    createdUser = await createUser(
      { ...input, phoneNumber: null, firstName: null, lastName: null },
      dbConnection
    );
    await createTrainer(input, createdUser.insertId, dbConnection);
  }

  if (accountType === "personal") {
    createdUser = await createUser(input, dbConnection);
  }

  const token = createToken({ email });

  await sendMail(
    email,
    accountType === "gym"
      ? "groundRegistration"
      : accountType === "trainer"
      ? "trainerRegistration"
      : "userRegistration",
    name
  );

  const userObject = {
    id: createdUser.insertId,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phoneNumber: input.phoneNumber,
    accountType: input.accountType,
  };

  return { user: userObject, token };
};

export const changePassword = async (
  _,
  { oldPassword, newPassword, token },
  { dbConnection }
) => {
  const decodedUserId = getUserEmailFromToken(token);
  const dbResponse = await getUserByEmail(decodedUserId.email, dbConnection);
  const user = dbResponse[0];

  const passwordMatches = await argon2.verify(user.PASSWORD, oldPassword);

  if (!passwordMatches) {
    throw new Error("Původní heslo není správné");
  }

  const newPasswordHash = await argon2.hash(newPassword);
  await updatePassword(dbConnection, decodedUserId.email, newPasswordHash);

  return { void: "" };
};

export const changeLostPassword = async (
  _,
  { newPassword, token },
  { dbConnection }
) => {
  const dbVal = await findByToken(token, dbConnection);

  if (Date.now() - dbVal[0].CREATED_AT < 3600000) {
    const user = await findUserById(dbVal[0].USER_ID, dbConnection);

    const newPasswordHash = await argon2.hash(newPassword);
    await updatePassword(dbConnection, user[0].EMAIL, newPasswordHash);

    await invalidateToken(token, dbConnection);
    return true;
  }
  // INVALIDATE TOKEN
  await invalidateToken(token, dbConnection);
  return false;
};

export const updateUser = async (_, { userRequest }, { dbConnection }) => {
  const { email, emailChanged } = userRequest;
  if (emailChanged) {
    await checkExistingUser(email, dbConnection);
  }
  let finalToken = userRequest.token;

  const updatedUser = await updateUserDb(userRequest, dbConnection);

  if (emailChanged) {
    finalToken = createToken({ email: updatedUser[0].EMAIL });
  }
  return { user: mapUserToDto(updatedUser[0]), token: finalToken };
};
