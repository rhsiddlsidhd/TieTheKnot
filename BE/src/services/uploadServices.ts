import { CustomError } from "../controller/oauthController";

type uploadPayload =
  | Express.Multer.File[]
  | { [fieldname: string]: Express.Multer.File[] }
  | undefined;

class UploadServices {
  createFileName = (files: uploadPayload): string => {
    let fileUrl;
    if (!files) {
      throw new CustomError(400, `req.files is ${typeof files}`);
    }

    if (!Array.isArray(files)) {
      throw new CustomError(400, `TypeError files.forEach is not a function`);
    }

    files.forEach((item) => {
      fileUrl = item.filename;
    });

    if (!fileUrl) {
      throw new CustomError(500, `File name could not a generated`);
    }

    return fileUrl;
  };
}

const uploadServices = new UploadServices();

export default uploadServices;
