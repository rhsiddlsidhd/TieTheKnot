import { Request, Response } from "express";
import { oauthService } from "../services/oauthService";
import { userService } from "../services/userService";

import DetailInfoModel from "./../models/detailInfoSchema";

class UserController {
  putDetailInfo = async (req: Request, res: Response) => {
    console.log(req.body);
    const { weddingAddress, weddingDate, isAccount, parents } = req.body;

    const infoData = await oauthService.fetchUser();
    const { sub: googleId } = infoData;
    const user = await userService.findUserByGoogleId(googleId);

    const userDetailInfo = await DetailInfoModel.findOneAndUpdate(
      { user: user._id },
      { weddingAddress, weddingDate, isAccount, parents },
      { new: true }
    );
    console.log(userDetailInfo);
  };
}
export const userController = new UserController();
