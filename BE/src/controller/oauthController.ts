import { Request, Response } from "express";
import { userService } from "../services/userService";
import { oauthService } from "../services/oauthService";

const url = require("url");

interface CustomErrorInterface {
  status: number;
}

export class CustomError extends Error implements CustomErrorInterface {
  constructor(public status: number, message: string) {
    super(message);
  }
}

class OAuthController {
  getGoogleOAuth = (req: Request, res: Response): void => {
    const authorizationUrl = oauthService.createOAuthUrl(req);
    res.redirect(authorizationUrl);
  };

  googleOAuthCallback = async (req: Request, res: Response): Promise<void> => {
    /**
     * 에러처리 고민해볼것,,
     */
    try {
      const tokens = await oauthService.handleOAuthCallback(req, res);
      const { access_token } = tokens;

      const infoData = await oauthService.fetchUser();
      const { email, sub: googleId } = infoData;

      await userService.saveUser(email, googleId);

      const user = await userService.findUserByGoogleId(googleId);
      await userService.saveDetailInfo(user);

      await oauthService.setAccessTokenToCookie(access_token, res);

      res.redirect("http://localhost:3000/register");
    } catch (error: unknown) {
      console.error(error);
      const authorizationUrl = oauthService.createOAuthUrl(req);
      res.redirect(authorizationUrl);
    }
  };

  getAuthenticationStatus = async (req: Request, res: Response) => {
    res.status(200).json({ message: "LOGIN_SUCCESS" });
  };
}

export const oauthController = new OAuthController();
