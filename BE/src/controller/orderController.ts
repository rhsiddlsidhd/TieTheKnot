import { Request, Response } from "express";
import Account from "../models/accountSchema";
import Parents from "../models/parentsSchema";
import { CustomError } from "./oauthController";
import OrderModel from "../models/orderSchema";
import { oauthService } from "../services/oauthService";
import { userService } from "../services/userService";

class OrderController {
  postWeddingOrder = async (req: Request, res: Response) => {
    try {
      console.log(req.body);
      const {
        weddingAddress,
        weddingDate,
        isAccount,
        parents,
        thumnail,
        gallery,
      } = req.body;

      const infoData = await oauthService.fetchUser();
      const { sub: googleId } = infoData;
      const user = await userService.findUserByGoogleId(googleId);

      if (!weddingAddress) {
        throw new CustomError(400, `웨딩홀 주소는 필수 입력입니다.`);
      }

      if (!weddingDate) {
        throw new CustomError(400, `웨딩 날짜, 시간은 필수 입력입니다.`);
      }

      if (thumnail.length !== 2) {
        throw new CustomError(
          400,
          `썸네일은 필수 입력입니다. 총 두장을 선택해주세요.`
        );
      }

      if (!gallery) {
        throw new CustomError(
          400,
          `갤러리는 필수 입력입니다. 1가지 타입 이상 선택해주세요.`
        );
      }

      const newData = new OrderModel({
        user: user._id,
        weddingAddress,
        weddingDate,
        isAccount,
        parents,
        thumnail,
        gallery,
      });

      await newData.save();

      res.status(200).json({
        message: "success",
      });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).json({
          name: error.name,
          message: error.message,
        });
      } else {
        console.error(error);
      }
    }
  };
}

export const orderController = new OrderController();
