import { resolveUndefined } from "../utils";

export const createGym = async (input, dbConnection) => {
  const {
    name,
    street,
    registrationNumber,
    descNumber,
    city,
    zip,
    website,
    facebook,
    about,
    instagram,
    images,
    email,
    phoneNumber,
  } = { ...input };
  return dbConnection.query(
    `INSERT INTO SPORTS_GROUND (ID, NAME, STREET, REGISTRATION_NUMBER,
 DESC_NUMBER, CITY, ZIP, WEBSITE, FACEBOOK, ABOUT, INSTAGRAM, IMAGES, EMAIL, PHONE_NUMBER) 
    VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      name,
      street,
      registrationNumber,
      resolveUndefined(descNumber),
      city,
      zip,
      resolveUndefined(website),
      resolveUndefined(facebook),
      resolveUndefined(about),
      resolveUndefined(instagram),
      resolveUndefined(images),
      email,
      resolveUndefined(phoneNumber),
    ]
  );
};

export const updateSportsGround = async (sportsGround, dbConnection) => {
  const {
    id,
    name,
    street,
    descNumber,
    city,
    zip,
    phoneNumber,
    email,
    facebook,
    instagram,
    about,
    registrationNumber,
  } = sportsGround;
  await dbConnection.query(
    "UPDATE SPORTS_GROUND SET NAME = ?, STREET = ?, DESC_NUMBER = ?, CITY = ?, ZIP = ?, PHONE_NUMBER = ?, EMAIL = ?, FACEBOOK = ?, INSTAGRAM = ?, ABOUT = ?, REGISTRATION_NUMBER = ? WHERE ID= ?;",
    [
      name,
      street,
      descNumber,
      city,
      zip,
      phoneNumber,
      email,
      facebook,
      instagram,
      about,
      registrationNumber,
      id,
    ]
  );
  return dbConnection.query("SELECT * FROM SPORTS_GROUND WHERE ID = ?;", [id]);
};

export const getSportsGroundsBySportTypes = async (
  sportTypes,
  dbConnection
) => {
  const listOfIds = sportTypes.map((type) => type.id);
  return dbConnection.query(
    "select * from SPORTS_GROUND where id in (select SPORTS_GROUND_ID from sports_ground_has_sport_type where Sport_type_id in (?))",
    [listOfIds]
  );
};

export const getSportsGrounds = async (dbConnection) =>
  dbConnection.query("select * from SPORTS_GROUND");

export const updateSportsGroundSportTypes = async (
  gymId,
  sportTypeId,
  isDelete,
  dbConnection
) => {
  if (isDelete) {
    return dbConnection.query(
      "DELETE FROM SPORTS_GROUND_HAS_SPORT_TYPE WHERE SPORTS_GROUND_ID = (?) AND SPORT_TYPE_ID = (?)",
      [gymId, sportTypeId]
    );
  }
  return dbConnection.query(
    "INSERT INTO SPORTS_GROUND_HAS_SPORT_TYPE (SPORTS_GROUND_ID, SPORT_TYPE_ID) VALUES (?, ?);",
    [gymId, sportTypeId]
  );
};

export const getGymsPhotos = async (gymId, dbConnection) =>
  dbConnection.query("SELECT IMAGES FROM SPORTS_GROUND WHERE ID = (?)", [
    gymId,
  ]);

export const updateGymPhotos = async (
  gymId,
  listOfPhotosAsString,
  dbConnection
) =>
  dbConnection.query("UPDATE SPORTS_GROUND SET IMAGES = ? WHERE ID = ?;", [
    listOfPhotosAsString,
    gymId,
  ]);
