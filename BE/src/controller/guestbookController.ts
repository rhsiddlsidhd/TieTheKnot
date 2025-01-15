import { Request, Response } from "express";
import GuestBook from "../models/guestbookSchema";
import { CustomError } from "./oauthController";
import { genSaltSync, hashSync } from "bcrypt-ts";
import passwordService from "../services/passwordService";

class GuestbookController {
  getTotalGuestbook = async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;

      const findGusetbooks = await GuestBook.find(
        { orderId },
        "-__v -orderId -_id"
      );

      res.status(200).json({ findGusetbooks });
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

      //중복닉네임은 저장 X
      const gusetbook = new GuestBook({
        nickname,
        orderId,
        password: hash,
        content,
      });

      await gusetbook.save();

      res.status(200).json({
        message: "POST_SUCCESS",
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

  deleteGuestBook = async (req: Request, res: Response) => {
    try {
      const { password, nickname } = req.body;

      const getGuestbookByNickname = await GuestBook.findOne({ nickname });

      if (!getGuestbookByNickname) {
        throw new CustomError(400, "게시글이 존재하지 않습니다.");
      }
      passwordService.checkToPassword(
        password,
        getGuestbookByNickname.password
      );

      await GuestBook.deleteOne({ nickname });

      res.status(200).json({
        message: "DELETE_SUCCESS",
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
}

const guestBookController = new GuestbookController();

export default guestBookController;
