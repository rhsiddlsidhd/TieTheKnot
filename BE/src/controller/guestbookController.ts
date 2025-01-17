import { Request, Response } from "express";
import GuestBook from "../models/guestbookSchema";
import { CustomError } from "./oauthController";
import passwordService from "../services/passwordService";
import mongoose from "mongoose";

class GuestbookController {
  getTotalGuestbook = async (req: Request, res: Response) => {
    try {
      const limit = Number(req.query.limit);
      const page = Number(req.query.page);
      const orderId = req.query.id;

      if (isNaN(limit) || isNaN(page) || limit <= 0 || page <= 0) {
        throw new CustomError(400, "limit and page is impossible");
      }

      const totaldata = await GuestBook.find(
        { orderId },
        "-__v -orderId -_id -password -updatedAt"
      );

      const data = await GuestBook.find(
        { orderId },
        "-__v -orderId -_id -password -updatedAt -createdAt"
      )
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      res.status(200).json({
        data,
        tatalCount: totaldata.length,
        currentPage: page,
        pageSize: limit,
        totalPages: Math.ceil(totaldata.length / limit),
        hasMore: page < Math.ceil(totaldata.length / limit),
        nextPage: page + 1,
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

  postGuestbook = async (req: Request, res: Response) => {
    try {
      const { nickname, orderId, password, content } = req.body;
      const getGuestbookByNickname = await GuestBook.findOne({ nickname });

      if (getGuestbookByNickname) {
        throw new CustomError(400, "중복 닉네임이 존재합니다.");
      }

      const hash = passwordService.hashToPassword(password);
      const orderObjectId = new mongoose.Types.ObjectId(String(orderId));

      const newData = new GuestBook({
        nickname,
        orderId: orderObjectId,
        password: hash,
        content,
      });

      await newData.save();

      const data = { nickname: newData.nickname, content: newData.content };

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

  deleteGuestBook = async (req: Request, res: Response) => {
    try {
      const { password, nickname } = req.body;

      const getGuestbookByNickname = await GuestBook.findOne({ nickname });

      if (!getGuestbookByNickname) {
        throw new CustomError(400, "닉네임이 틀렸습니다.");
      }
      passwordService.checkToPassword(
        password,
        getGuestbookByNickname.password
      );

      await GuestBook.deleteOne({ nickname });

      const data = {
        nickname,
      };
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

const guestBookController = new GuestbookController();

export default guestBookController;
