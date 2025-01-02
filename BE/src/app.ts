import mongoose from "mongoose";
import { MongoClient } from "mongodb";
import { load } from "ts-dotenv";
import express from "express";
const app = express();

const env = load({
  MONGODB_URL: String,
  PORT: Number,
});

const client = new MongoClient(env.MONGODB_URL);

const main = async () => {
  await mongoose.connect(`${env.MONGODB_URL}`);
};

main().catch((error: unknown) => console.log(error));

app.listen(env.PORT, () => {
  console.log(`server open >>>>>>>> ${env.PORT}`);
});
