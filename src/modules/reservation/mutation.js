import { findEventById } from "../events/sql";
import { createUserReservation, deleteReservationByUser } from "./sql";
import { getEventReservationCountInternal } from "./query";

export const createReservation = async (
  _,
  { userId, eventId },
  { dbConnection }
) => {
  const resCount = await getEventReservationCountInternal(
    eventId,
    dbConnection
  );
  const evt = await findEventById(eventId, dbConnection);
  if (evt && evt[0] && evt[0].CAPACITY > resCount) {
    await createUserReservation(userId, eventId, dbConnection);
    return true;
  }
  return false;
};

export const deleteReservation = async (
  _,
  { userId, eventId },
  { dbConnection }
) => {
  await deleteReservationByUser(userId, eventId, dbConnection);
  return true;
};
