import { Request, Response } from "express";

const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const { load } = require("ts-dotenv");
const express = require("express");
const { google } = require("googleapis");
const session = require("express-session");
const nodeCrypto = require("crypto");

const app = express();
const env = load({
  MONGODB_URL: String,
  PORT: Number,
  GOOGLE_CLIENT_ID: String,
  GOOGLE_CLIENT_PASSWORD: String,
  GOOGLE_REDIRECT_URI: String,
});

const oauth2Client = new google.auth.OAuth2(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_PASSWORD,
  env.GOOGLE_REDIRECT_URI
);

const scopes = ["https://www.googleapis.com/auth/userinfo.email"];
const state = nodeCrypto.randomBytes(32).toString("hex");

const client = new MongoClient(env.MONGODB_URL);

const main = async () => {
  await mongoose.connect(`${env.MONGODB_URL}`);
};
main().catch((error: unknown) => console.log(error));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
  })
);

app.get("/auth", function (req: Request, res: Response) {
  req.session.state = state;
  console.log(req.session);
  res.redirect(authorizationUrl);
  // res.send("check your console");
});

const authorizationUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
  include_granted_scopes: true,
  state,
});

app.listen(env.PORT, () => {
  console.log(`server open >>>>>>>> ${env.PORT}`);
});

/**
 * OAuth2.0 페이지에 들어와 로그인 이후에
 * session에 access token을 발급
 * Client = session state를 보고 로그인 유저 확인
 * 로그인 유저는 등록페이지와 내정보보기 페이지 접근 가능
 */
