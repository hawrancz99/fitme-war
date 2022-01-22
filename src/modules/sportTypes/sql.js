// eslint-disable-next-line import/prefer-default-export
export const getSportTypes = async (dbConnection) => {
  return dbConnection.query("select * from sport_type");
};
