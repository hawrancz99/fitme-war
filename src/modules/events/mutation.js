import { deleteEventsDb, insertEvent, updateEventDb } from "./sql";

export const addEvent = async (_, { eventRequest }, { dbConnection }) => {
  const response = await insertEvent(eventRequest, dbConnection);
  return {
    ...eventRequest,
    id: response.insertId,
    sportTypeId: eventRequest.sportType.id,
  };
};

export const updateEvent = async (_, { eventRequest }, { dbConnection }) => {
  await updateEventDb(eventRequest, dbConnection);
  return { ...eventRequest, sportTypeId: eventRequest.sportType.id };
};

export const deleteEvents = async (_, { ids }, { dbConnection }) => {
  await deleteEventsDb(ids, dbConnection);
  return true;
};
