const distance = require("google-distance-matrix");

// eslint-disable-next-line import/prefer-default-export
export async function getGoogleDistanceApi(origin, destinations) {
  return new Promise((resolve, reject) => {
    distance.key(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
    distance.matrix(origin, destinations, (err, distances) =>
      err ? reject(err) : resolve(distances)
    );
  });
}

export const filterGoogleResults = async (
  googleApiResult,
  destinations,
  possibleResults
) => {
  if (googleApiResult && googleApiResult.status == "OK") {
    for (let j = 0; j < destinations.length; j++) {
      if (googleApiResult.rows[0].elements[j].status == "OK") {
        const distance = googleApiResult.rows[0].elements[j].distance.value;
        const valueInKm = distance * 0.001;

        possibleResults.forEach((result) => {
          if (destinations[j] === result.fullAddress) {
            result.distanceFromUser = valueInKm;
          }
        });
        if (valueInKm > 10) {
          possibleResults = possibleResults.filter(
            (result) => result.fullAddress !== destinations[j]
          );
        }
      } else {
        possibleResults = possibleResults.filter(
          (result) => result.fullAddress !== destinations[j]
        );
      }
    }
  } else {
    return new Error("Vyhledávání selhalo");
  }
  return possibleResults;
};
