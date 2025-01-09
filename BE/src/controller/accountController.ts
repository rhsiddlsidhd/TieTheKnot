import { Request, Response } from "express";
import AccountModel from "../models/accountSchema";
import { AccountSchema } from "./../models/accountSchema";

type AccountPayload = Omit<AccountSchema, "_id">;

class AccountContoroller {
  postAccountInfo = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log(req.body);
      const payload: AccountPayload = req.body;

      if (!req.body) {
        throw new Error(`body is ${typeof req.body}`);
      }

      const { name, bankDetail } = payload;

      const account = new AccountModel({
        name,
        bankDetail,
      });

      await account.save();

      res.status(200).json({
        message: "ACCOUNT_SUCCESS",
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          message: error.message,
        });
      }
    }
  };
}

export const accountContoroller = new AccountContoroller();
