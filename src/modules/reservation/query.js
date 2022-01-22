import { findAllByEventId } from "./sql";

export const getEventReservationCountInternal = async (
  eventId,
  dbConnection
) => {
  const reservations = await findAllByEventId(eventId, dbConnection);
  return reservations.length ? reservations.length : 0;
};

export const getEventReservationCount = async (
  _,
  { eventId },
  { dbConnection }
) => {
  return getEventReservationCountInternal(eventId, dbConnection);
};
