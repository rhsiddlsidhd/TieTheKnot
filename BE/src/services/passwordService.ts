import { CustomError } from "../controller/oauthController";
import GuestBook from "../models/guestbookSchema";

const bcrypt = require("bcrypt");

class PasswordService {
  hashToPassword = (password: string) => {
    const _password = password;
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(_password, salt);
    return hash;
  };

  checkToPassword = (password: string, hash: string) => {
    const _password = password;
    const _hash = hash;

    if (!bcrypt.compareSync(_password, _hash)) {
      throw new CustomError(400, "비밀번호가 틀렸습니다.");
    }

    return true;
  };
}

const passwordService = new PasswordService();
export default passwordService;
