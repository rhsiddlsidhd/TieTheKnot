import { Request, Response } from "express";
import { CustomError } from "./oauthController";
import OrderModel from "../models/orderSchema";
import { oauthService } from "../services/oauthService";
import { userService } from "../services/userService";
import orderService from "../services/orderService";

class OrderController {
  postWeddingOrder = async (req: Request, res: Response) => {
    try {
      const data = req.body;

      const {
        weddingAddress,
        weddingDate,
        account,
        parent,
        thumnail,
        gallery,
      } = orderService.orderDataVerify(data);

      const infoData = await oauthService.fetchUser();
      const { sub: googleId } = infoData;
      const user = await userService.findUserByGoogleId(googleId);

      const newData = new OrderModel({
        user: user._id,
        weddingAddress,
        weddingDate,
        account: account.length === 0 ? null : account,
        parent: parent.length === 0 ? null : parent,
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
      } else if (error instanceof Error) {
        res.json({
          message: error.message,
        });
      } else {
        res.json({
          error,
        });
      }
    }
  };

  getWeddingOrder = async (req: Request, res: Response) => {
    /**
     * 현재 API 조회시에는 쿠키에 토큰이 있는걸 가져와서 유저 조회해서 원하는 Order data를 가져옴 즉) 로그인을 해야 볼수있음
     *
     * 배포 API조회시에는 req.body로 user ID 값을 로컬에서 직접 바로 전달해서 배포 웹에는 유저 order를 볼 수 있도록 개선 ) 로그인 X 배포 사이트에서 데이터 조회해서 볼 수 있도록 해야함
     */
    try {
      const infoData = await oauthService.fetchUser();
      const { sub: googleId } = infoData;
      const user = await userService.findUserByGoogleId(googleId);
      const data = await OrderModel.findOne(
        { user: user._id },
        "-__v -_id -user"
      );
      res.status(200).json(data);
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
        res.json({
          error,
        });
      }
    }
  };
}

export const orderController = new OrderController();
