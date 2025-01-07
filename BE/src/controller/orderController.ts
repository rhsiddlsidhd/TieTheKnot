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

      let accountId = null;
      if (isAccount) {
        console.log(isAccount);
        const newAccount = new Account(isAccount);
        await newAccount.save();
        accountId = newAccount;
      }

      let parentsId = null;
      if (parents) {
        const newParents = new Parents(parents);
        await newParents.save();
        parentsId = newParents;
      }

      if (!weddingAddress || !weddingDate) {
        throw new CustomError(400, `weddingAddress, weddingDate is require`);
      }

      const newData = new OrderModel({
        user: user._id,
        weddingAddress,
        weddingDate,
        isAccount: accountId,
        parents: parentsId,
        thumnail,
        gallery,
      });

      await newData.save();

      res.json({
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
        console.error(error);
      }
    }
  };
}

export const orderController = new OrderController();
