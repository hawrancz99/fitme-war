import { getGymsPhotos, updateGymPhotos } from "../sportsGround/sql";
import { getTrainerPhotos, updateTrainerPhotos } from "./sql";
import path from "path";

const fs = require("fs");
const { finished } = require("stream");

const handleDeleteGymPhotos = async (id, link, dbConnection) => {
  const gymPhotos = await getGymsPhotos(id, dbConnection);
  const asList = JSON.parse(gymPhotos[0].IMAGES);
  const newList = asList.filter((singlePhoto) => singlePhoto !== link);
  await updateGymPhotos(id, JSON.stringify(newList), dbConnection);
};

const handleAddGymPhotos = async (id, link, dbConnection) => {
  let listOfPhotos = [];
  const photosResponse = await getGymsPhotos(id, dbConnection);
  const images = photosResponse[0].IMAGES;
  if (!images) {
    listOfPhotos.push(link);
  } else {
    listOfPhotos = JSON.parse(images);
    listOfPhotos.push(link);
  }
  await updateGymPhotos(id, JSON.stringify(listOfPhotos), dbConnection);
};

const handleAddTrainerPhotos = async (id, link, dbConnection) => {
  let listOfPhotos = [];
  const photosResponse = await getTrainerPhotos(id, dbConnection);
  const images = photosResponse[0].IMAGES;
  if (!images) {
    listOfPhotos.push(link);
  } else {
    listOfPhotos = JSON.parse(images);
    listOfPhotos.push(link);
  }
  await updateTrainerPhotos(id, JSON.stringify(listOfPhotos), dbConnection);
};

const handleDeleteTrainerPhotos = async (id, link, dbConnection) => {
  const trainerPhotos = await getTrainerPhotos(id, dbConnection);
  const asList = JSON.parse(trainerPhotos[0].IMAGES);
  const newList = asList.filter((singlePhoto) => singlePhoto !== link);
  await updateTrainerPhotos(id, JSON.stringify(newList), dbConnection);
};

export const deletePhoto = async (
  _,
  { id, link, accountType },
  { dbConnection, driveService }
) => {
  accountType === "gym" &&
    (await handleDeleteGymPhotos(id, link, dbConnection));
  accountType === "trainer" &&
    (await handleDeleteTrainerPhotos(id, link, dbConnection));
  await driveService.files.delete({ fileId: link.substring(43) });
  return link;
};

const handleFolderUpload = (createReadStream, uploadPath) =>
  new Promise((resolve) => {
    const readStream = createReadStream();
    const writeStream = fs.createWriteStream(uploadPath);
    readStream.pipe(writeStream);
    finished(readStream, () => resolve());
  });

export const singleUpload = async (
  parent,
  { file, id, accountType },
  { driveService, dbConnection }
) => {
  const { createReadStream, filename, mimetype, encoding } = await file;

  const uploadPath = path.join(__dirname, "..", "..", "images", filename);

  await handleFolderUpload(createReadStream, uploadPath);

  const fileMetaData = {
    name: filename,
    parents: ["1f4vZ_iuKFkKtOAFvBwfxHbKVj2oa5U5w"],
  };

  const media = {
    mimeType: mimetype,
    body: await createReadStream(uploadPath),
  };

  const response = await driveService.files.create({
    resource: fileMetaData,
    media,
    fields: "id",
  });

  let link;
  if (response.status === 200) {
    link = `https://drive.google.com/uc?export=view&id=${response.data.id}`;
    accountType === "gym" && (await handleAddGymPhotos(id, link, dbConnection));
    accountType === "trainer" &&
      (await handleAddTrainerPhotos(id, link, dbConnection));
  } else {
    throw new Error("Nepovedlo se nahrát fotku");
  }

  fs.unlinkSync(uploadPath);

  return {
    filename,
    mimetype,
    encoding,
    link,
  };
};
