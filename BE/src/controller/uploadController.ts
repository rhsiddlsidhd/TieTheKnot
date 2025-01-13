import { Request, Response } from "express";
import { CustomError } from "./oauthController";
import uploadServices from "../services/uploadServices";

class UploadController {
  postGalleryUrl = (req: Request, res: Response) => {
    try {
      const files = req.files;
      const fileUrl = uploadServices.createFileName(files);

      res.status(200).json({
        fileUrl,
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

const uploadController = new UploadController();

export default uploadController;
