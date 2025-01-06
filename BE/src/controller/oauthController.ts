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

      res.redirect("http://localhost:3000/");
    } catch (error: unknown) {
      console.error(error);
      const authorizationUrl = oauthService.createOAuthUrl(req);
      res.redirect(authorizationUrl);
    }
  };

  getAuthenticationStatus = async (req: Request, res: Response) => {
    try {
      const jwt = req.cookies.__knot_jwt.split(" ")[1];

      await oauthService.accessTokenVerify(jwt);

      res.status(200).json({ authenticate: true });
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
        res.status(500).json({
          message: error,
        });
      }
    }
  };
}

export const oauthController = new OAuthController();
