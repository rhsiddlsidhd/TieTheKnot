import { Request, Response } from "express";
import Account from "../models/accountSchema";
import Parents from "../models/parentsSchema";
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
      } else {
        console.error(error);
      }
    }
  };
}

export const orderController = new OrderController();
