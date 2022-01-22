import { resolveUndefined } from "../utils";

export const getTrainersEvents = async (id, dbConnection) => {
  return dbConnection.query(
    "SELECT * FROM EVENT WHERE TRAINER_ID = ? ORDER BY DATE_FROM ASC",
    [id]
  );
};

export const getSportsGroundsEvents = async (id, dbConnection) => {
  return dbConnection.query(
    "SELECT * FROM EVENT WHERE SPORTS_GROUND_ID = ? ORDER BY DATE_FROM ASC",
    [id]
  );
};

export const insertEvent = async (request, dbConnection) => {
  const {
    dateFrom,
    dateTo,
    name,
    fullAddress,
    about,
    price,
    sportsGroundId,
    trainerId,
    sportType,
    capacity,
  } = { ...request };
  return dbConnection.query(
    `INSERT INTO EVENT (ID, DATE_FROM, DATE_TO, NAME, LOCATION, ABOUT, PRICE, SPORTS_GROUND_ID, TRAINER_ID, SPORT_TYPE_ID, CAPACITY) 
    VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      new Date(dateFrom),
      new Date(dateTo),
      name,
      fullAddress,
      about,
      price,
      resolveUndefined(sportsGroundId),
      resolveUndefined(trainerId),
      sportType.id,
      capacity,
    ]
  );
};

export const updateEventDb = async (request, dbConnection) => {
  const { dateFrom, dateTo, name, fullAddress, about, price, sportType, id } = {
    ...request,
  };
  return dbConnection.query(
    "UPDATE EVENT SET DATE_FROM = ?, DATE_TO = ?, NAME = ?, LOCATION = ?, ABOUT = ?, PRICE = ?, SPORT_TYPE_ID = ? WHERE ID = ?;",
    [dateFrom, dateTo, name, fullAddress, about, price, sportType.id, id]
  );
};

export const deleteEventsDb = async (ids, dbConnection) => {
  return dbConnection.query("DELETE FROM EVENT WHERE ID in (?)", [ids]);
};

export const findEventsByEventIds = async (eventIds, dbConnection) => {
  return dbConnection.query(
    "SELECT * FROM EVENT WHERE ID IN (?) ORDER BY DATE_FROM ASC;",
    [eventIds]
  );
};

export const findEventById = async (eventId, dbConnection) => {
  return dbConnection.query("SELECT * FROM EVENT WHERE ID = ?;", [eventId]);
};

export const getEventsBySportTypes = async (sportTypes, dbConnection) => {
  const listOfIds = sportTypes.map((type) => type.id);
  return dbConnection.query("select * from EVENT where SPORT_TYPE_ID in (?)", [
    listOfIds,
  ]);
};

export const getAllEvents = async (dbConnection) => {
  return dbConnection.query("select * from EVENT");
};
