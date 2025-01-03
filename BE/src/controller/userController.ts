import { Request, Response } from "express";
import { userService } from "../services/userService";
import { oauthService } from "../services/oauthService";

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
    try {
      let urlObj = new URL(req.url, `http://${req.headers.host}`);
      let q = urlObj.searchParams;
      const error = q.get("error");
      const state = q.get("state");

      if (error !== null) {
        throw new CustomError(400, error);
      }
      if (state !== req.session.state) {
        throw new CustomError(403, "State mismatch. Possible CSRF attack.");
      }

      const infoData = await oauthService.handleOAuthCallback(q.get("code"));

      await userService.createEmail(infoData.email, infoData.sub);
      res.redirect("http://localhost:3000/");
    } catch (error: unknown) {
      const authorizationUrl = oauthService.createOAuthUrl(req);
      res.redirect(authorizationUrl);
    }
  };

  getAccessToken = (req: Request, res: Response): void => {
    try {
      const accessToken = oauthService.accessTokenService();
      res.status(200).json({
        authenticated: true,
        accessToken,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.status).json({
          name: error.name,
          message: error.message,
        });
      } else {
        res.status(500).json({
          message: "Server Error",
        });
      }
    }
  };
}

export const oauthController = new OAuthController();
