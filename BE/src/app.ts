import { NextFunction, Request, Response } from "express";
import { load } from "ts-dotenv";
const multer = require("multer");
const upload = multer({ dest: "upload/" });
const cookieparser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const indexRouter = require("./routers/router");
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

const app = express();

const env = load({
  MONGODB_URL: String,
  PORT: Number,
});
app.use(cookieparser());
app.use(cors(corsOptions));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  })
);
app.use(upload.array("photos", 12));
app.use(express.json());
app.use("/", indexRouter);

app.listen(env.PORT, () => {
  console.log(`server open >>>>>>>> ${env.PORT}`);
});

const main = async () => {
  await mongoose.connect(`${env.MONGODB_URL}`);
};

main().catch((error: unknown) => console.log(error));
/**
 * OAuth2.0 페이지에 들어와 로그인 이후에
 * session에 access token을 발급
 * Client = session state를 보고 로그인 유저 확인
 * 로그인 유저는 등록페이지와 내정보보기 페이지 접근 가능
 */
