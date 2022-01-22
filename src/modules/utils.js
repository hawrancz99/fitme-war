import moment from "moment";
import { getEventReservationCountInternal } from "./reservation/query";
import { findReserversionsByUserIdAndEventIds } from "./reservation/sql";

export const mapUserToDto = (user) => ({
  id: user.ID,
  firstName: user.FIRST_NAME,
  lastName: user.LAST_NAME,
  email: user.EMAIL,
  phoneNumber: user.PHONE_NUMBER,
  accountType: user.ACCOUNT_TYPE,
});

export const createFullAddress = (element) =>
  `${element.STREET} ${element.DESC_NUMBER}, ${element.CITY} ${element.ZIP}`;

export const mapSportsGroundToDto = (sportsGround) => ({
  id: sportsGround.ID,
  registrationNumber: sportsGround.REGISTRATION_NUMBER,
  name: sportsGround.NAME,
  fullAddress: createFullAddress(sportsGround),
  street: sportsGround.STREET,
  descNumber: sportsGround.DESC_NUMBER,
  city: sportsGround.CITY,
  zip: sportsGround.ZIP,
  website: sportsGround.WEBSITE,
  facebook: sportsGround.FACEBOOK,
  about: sportsGround.ABOUT,
  instagram: sportsGround.INSTAGRAM,
  images: sportsGround.IMAGES ? JSON.parse(sportsGround.IMAGES) : [],
  email: sportsGround.EMAIL,
  phoneNumber: sportsGround.PHONE_NUMBER,
  distanceFromUser: null,
});

export const mapEventToDto = (e) => ({
  id: e.ID,
  dateFrom: moment(e.DATE_FROM).format("YYYY-MM-DD[T]HH:mm:ss"),
  dateTo: moment(e.DATE_TO).format("YYYY-MM-DD[T]HH:mm:ss"),
  name: e.NAME,
  fullAddress: e.LOCATION,
  price: e.PRICE,
  about: e.ABOUT,
  capacity: e.CAPACITY,
  sportsGroundId: e.SPORTS_GROUND_ID,
  trainerId: e.TRAINER_ID,
  sportTypeId: e.SPORT_TYPE_ID,
  userLogged: e.userLogged,
  totalUsersLogged: e.totalUsersLogged,
  distanceFromUser: null,
});

export const mapTrainerToDto = (trainer) => ({
  id: trainer.ID,
  fullAddress: createFullAddress(trainer),
  firstName: trainer.FIRST_NAME,
  lastName: trainer.LAST_NAME,
  email: trainer.EMAIL,
  street: trainer.STREET,
  descNumber: trainer.DESC_NUMBER,
  city: trainer.CITY,
  zip: trainer.ZIP,
  phoneNumber: trainer.PHONE_NUMBER,
  website: trainer.WEBSITE,
  facebook: trainer.FACEBOOK,
  about: trainer.ABOUT,
  instagram: trainer.INSTAGRAM,
  images: trainer.IMAGES ? JSON.parse(trainer.IMAGES) : [],
  distanceFromUser: null,
});

export const mapSportTypeToDto = (sportType) => ({
  id: sportType.ID,
  name: sportType.NAME,
  varName: sportType.VAR_NAME,
});

export const mapReviewToDto = (review) => ({
  id: review.ID,
  value: review.VALUE,
  text: review.TEXT,
});

export const resolveUndefined = (val) => val || null;

export const doEventsLogic = async (response, parent, dbConnection) => {
  for (let i = 0; i < response.length; i++) {
    response[i].totalUsersLogged = await getEventReservationCountInternal(
      response[i].ID,
      dbConnection
    );
  }

  if (parent.reqParams?.userId) {
    const eventIds = response.map((evt) => evt.ID);
    if (eventIds && eventIds.length > 0) {
      const reservations = await findReserversionsByUserIdAndEventIds(
        parent.reqParams.userId,
        eventIds,
        dbConnection
      );
      const resIds = reservations.map((res) => res.Event_id);
      return response.map((evt) =>
        resIds.includes(evt.ID)
          ? mapEventToDto({ ...evt, userLogged: true })
          : mapEventToDto(evt)
      );
    }
  }

  return response.map(mapEventToDto);
};
