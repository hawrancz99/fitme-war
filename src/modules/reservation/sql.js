export const findReservationsByUserId = async (userId, dbConnection) =>
  dbConnection.query("SELECT * FROM RESERVATION WHERE USER_ID = ?;", [userId]);

export const findReserversionsByUserIdAndEventIds = async (
  userId,
  eventIds,
  dbConnection
) => {
  return dbConnection.query(
    "SELECT * FROM RESERVATION WHERE user_id = ? AND event_id IN (?);",
    [userId, eventIds]
  );
};

export const findAllByEventId = async (eventId, dbConnection) => {
  return dbConnection.query("SELECT * FROM RESERVATION WHERE EVENT_ID = ?", [
    eventId,
  ]);
};

export const createUserReservation = async (userId, eventId, dbConnection) => {
  return dbConnection.query(
    "INSERT INTO RESERVATION (ID, DATE, CREATED, EVENT_ID, USER_ID) VALUES (?, ?, ?, ?, ?)",
    [null, new Date(), new Date(), eventId, userId]
  );
};

export const deleteReservationByUser = async (
  userId,
  eventId,
  dbConnection
) => {
  return dbConnection.query(
    "DELETE FROM RESERVATION WHERE EVENT_ID = ? AND USER_ID = ?;",
    [eventId, userId]
  );
};
