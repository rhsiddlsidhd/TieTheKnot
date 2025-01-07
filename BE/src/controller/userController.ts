import { Request, Response } from "express";
import { oauthService } from "../services/oauthService";
import { userService } from "../services/userService";
import { detailInfoService } from "../services/detailInfoService";
import { CustomError } from "./oauthController";

class UserController {
  putDetailInfo = async (req: Request, res: Response): Promise<void> => {
    try {
      /**
       * body json으로~
       */
      const paylod = req.body;
      const infoData = await oauthService.fetchUser();
      const { sub: googleId } = infoData;
      const user = await userService.findUserByGoogleId(googleId);

      const data = await detailInfoService.updateUserInfo(user._id, paylod);

      res.status(200).json({
        message: `USER_DETAIL_INFO_UPDATE_SUCCESS`,
        data,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).json({
          name: error.name,
          message: error.message,
        });
      } else if (error instanceof Error) {
        res.json({
          message: error.message,
        });
      } else {
        console.error(error);
      }
    }
  };

  getDetailInfo = async (req: Request, res: Response): Promise<void> => {
    try {
      const infoData = await oauthService.fetchUser();
      const { sub: googleId } = infoData;
      const user = await userService.findUserByGoogleId(googleId);

      //내 상세정보 보기 모두 가져오기
      const data = await detailInfoService.findDetailInfoByUserId(user._id);

      res.status(200).json({
        message: `USER_DETAIL_INFO_GET_SUCCESS`,
        data,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).json({
          name: error.name,
          message: error.message,
        });
      } else if (error instanceof Error) {
        res.json({
          message: error.message,
        });
      } else {
        console.error(error);
      }
    }
  };
}
export const userController = new UserController();
