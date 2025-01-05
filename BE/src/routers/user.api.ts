import express, { Request, Response } from "express";
import { oauth2Client } from "../config/oauthConfig";
import User from "../models/userSchema";
import DetailInfoModel from "../models/detailInfoSchema";

const router = express.Router();

router.post("/detailInfo", async (req: Request, res: Response) => {
  const { weddingAddress, weddingData, isAccount, parents } = req.body;
  const jwt = req.cookies.__knot_jwt.split(" ")[1];
  // console.log(jwt);

  const response = await oauth2Client.getTokenInfo(jwt);

  const { sub } = response;

  const user = await User.findOne({ googleId: sub });

  if (!user) {
    throw new Error("User not found");
  }
  const detailInfo = new DetailInfoModel({
    user: user._id,
    weddingAddress,
    weddingData,
    isAccount,
    parents,
  });
  await detailInfo.save();

  res.send("success");
});

module.exports = router;
