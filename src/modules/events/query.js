import { mapEventToDto } from "../utils";
import {
  findEventsByEventIds,
  getSportsGroundsEvents,
  getTrainersEvents,
} from "../events/sql";
import { findReservationsByUserId } from "../reservation/sql";
import { getEventReservationCountInternal } from "../reservation/query";

export const getEvents = async (
  _,
  { userId, accountType },
  { dbConnection }
) => {
  let listOfEvents;
  if (accountType === "trainer") {
    listOfEvents = await getTrainersEvents(userId, dbConnection);
  } else if (accountType === "gym") {
    listOfEvents = await getSportsGroundsEvents(userId, dbConnection);
  }

  for (let i = 0; i < listOfEvents.length; i++) {
    listOfEvents[i].totalUsersLogged = await getEventReservationCountInternal(
      listOfEvents[i].ID,
      dbConnection
    );
  }
  return listOfEvents.map(mapEventToDto);
};

export const getEventsForUser = async (_, { userId }, { dbConnection }) => {
  const userReservations = await findReservationsByUserId(userId, dbConnection);
  const eventIds = [];
  userReservations.forEach((res) => {
    if (!eventIds.includes(res.Event_id)) {
      eventIds.push(res.Event_id);
    }
  });
  if (eventIds.length === 0) {
    return [];
  }
  const evts = await findEventsByEventIds(eventIds, dbConnection);
  for (let i = 0; i < evts.length; i++) {
    evts[i].totalUsersLogged = await getEventReservationCountInternal(
      evts[i].ID,
      dbConnection
    );
  }
  return evts.map((evt) => mapEventToDto({ ...evt, userLogged: true }));
};
