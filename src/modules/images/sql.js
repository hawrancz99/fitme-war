export const getTrainerPhotos = async (id, dbConnection) =>
  dbConnection.query("SELECT IMAGES FROM TRAINER WHERE ID = (?)", [id]);

export const updateTrainerPhotos = async (
  id,
  listOfPhotosAsString,
  dbConnection
) =>
  dbConnection.query("UPDATE TRAINER SET IMAGES = ? WHERE ID = ?;", [
    listOfPhotosAsString,
    id,
  ]);
