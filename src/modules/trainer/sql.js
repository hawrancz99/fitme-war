export const updateTrainerSportTypes = async (
  trainerId,
  sportTypeId,
  isDelete,
  dbConnection
) => {
  if (isDelete) {
    return dbConnection.query(
      "DELETE FROM TRAINER_HAS_SPORT_TYPE WHERE TRAINER_ID = (?) AND SPORT_TYPE_ID = (?)",
      [trainerId, sportTypeId]
    );
  }
  return dbConnection.query(
    "INSERT INTO TRAINER_HAS_SPORT_TYPE (TRAINER_ID, SPORT_TYPE_ID) VALUES (?, ?);",
    [trainerId, sportTypeId]
  );
};

export const updateTrainerDb = async (trainer, dbConnection) => {
  const {
    id,
    firstName,
    lastName,
    phoneNumber,
    email,
    facebook,
    instagram,
    about,
    street,
    descNumber,
    city,
    zip,
  } = trainer;
  await dbConnection.query(
    "UPDATE TRAINER SET STREET = ?, DESC_NUMBER = ?, CITY = ?, ZIP = ?, FIRST_NAME = ?, LAST_NAME = ?, PHONE_NUMBER = ?, EMAIL = ?, FACEBOOK = ?, INSTAGRAM = ?, ABOUT = ? WHERE ID= ?;",
    [
      street,
      descNumber,
      city,
      zip,
      firstName,
      lastName,
      phoneNumber,
      email,
      facebook,
      instagram,
      about,
      id,
    ]
  );
  return dbConnection.query("SELECT * FROM TRAINER WHERE ID = ?;", [id]);
};

export const getTrainersBySportTypes = async (sportTypes, dbConnection) => {
  const listOfIds = sportTypes.map((type) => type.id);
  return dbConnection.query(
    "select * from TRAINER where ID in (select TRAINER_ID from trainer_has_sport_type where Sport_type_id in (?))",
    [listOfIds]
  );
};

export const getTrainers = async (dbConnection) =>
  dbConnection.query("select * from TRAINER");
