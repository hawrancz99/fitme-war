import * as argon2 from "argon2";
import { resolveUndefined } from "../utils";

export const getUserByEmail = async (value, dbConnection) => {
  const user = await dbConnection.query("SELECT * FROM USER WHERE EMAIL = ?;", [
    value,
  ]);

  return user;
};

export const findUserById = async (id, dbConnection) => {
  const user = await dbConnection.query("SELECT * FROM USER WHERE ID = ?;", [
    id,
  ]);
  return user;
};

export const createUser = async (input, dbConnection) => {
  const { email, password, firstName, lastName, phoneNumber, accountType } = {
    ...input,
  };
  const passwordHash = await argon2.hash(password);
  return dbConnection.query(
    `INSERT INTO USER (ID, FIRST_NAME, LAST_NAME, EMAIL, PASSWORD, PHONE_NUMBER, ACCOUNT_TYPE) 
    VALUES (NULL, ?, ?, ?, ?, ?, ?);`,
    [
      resolveUndefined(firstName),
      resolveUndefined(lastName),
      email,
      passwordHash,
      phoneNumber,
      accountType,
    ]
  );
};

export const updatePassword = async (
  dbConnection,
  decodedUserMail,
  newPassword
) =>
  dbConnection.query("UPDATE USER SET PASSWORD = ? WHERE EMAIL = ?;", [
    newPassword,
    decodedUserMail,
  ]);

export const createTrainer = async (input, userId, dbConnection) => {
  const {
    email,
    firstName,
    lastName,
    phoneNumber,
    street,
    descNumber,
    city,
    zip,
  } = { ...input };
  return dbConnection.query(
    `INSERT INTO TRAINER (ID, FIRST_NAME, LAST_NAME, EMAIL, PHONE_NUMBER, USER_ID, STREET,
 DESC_NUMBER, CITY, ZIP) 
    VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      firstName,
      lastName,
      email,
      resolveUndefined(phoneNumber),
      userId,
      street,
      descNumber,
      city,
      zip,
    ]
  );
};

export const getTrainerByUserId = async (userId, dbConnection) => {
  return await dbConnection.query("SELECT * FROM TRAINER WHERE USER_ID = ?;", [
    userId,
  ]);
};

export const insertIntoUserGym = async (userId, gymId, dbConnection) =>
  dbConnection.query(
    `INSERT INTO USER_HAS_SPORTS_GROUND (USER_ID, SPORTS_GROUND_ID) 
    VALUES (?, ?);`,
    [userId, gymId]
  );

export const updateUserDb = async (user, dbConnection) => {
  const { firstName, lastName, phoneNumber, email, id } = user;
  await dbConnection.query(
    "UPDATE USER SET FIRST_NAME = ?, LAST_NAME = ?, PHONE_NUMBER = ?, EMAIL = ? WHERE ID = ?;",
    [firstName, lastName, phoneNumber, email, id]
  );

  return dbConnection.query("SELECT * FROM USER WHERE ID = ?;", [id]);
};

export const checkExistingUser = async (email, dbConnection) => {
  const userByEmail = (
    await dbConnection.query("SELECT * FROM user WHERE EMAIL = ?", [email])
  )[0];

  if (userByEmail) {
    throw new Error("Tento email je již zaregistrován");
  }
};
