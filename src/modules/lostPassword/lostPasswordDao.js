export const createNewToken = async (userId, hashId, dbConnection) =>
  dbConnection.query(
    `INSERT INTO LOST_PASSWORD 
    (ID, HASH_ID, CREATED_AT, COMPLETED_AT, USER_ID) VALUES (NULL,?,?,NULL,?)`,
    [hashId, Date.now(), userId]
  );

export const findByToken = async (token, dbConnection) =>
  dbConnection.query("SELECT * FROM LOST_PASSWORD WHERE HASH_ID = ?", [token]);

export const invalidateToken = async (token, dbConnection) =>
  dbConnection.query(
    "UPDATE LOST_PASSWORD SET COMPLETED_AT = ? WHERE HASH_ID = ?",
    [Date.now(), token]
  );
