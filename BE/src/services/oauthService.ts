import { google } from "googleapis";
import { load } from "ts-dotenv";
import { CustomError } from "../controller/userController";
import { Request } from "express";
import crypto from "crypto";

const env = load({
  GOOGLE_CLIENT_ID: String,
  GOOGLE_CLIENT_PASSWORD: String,
  GOOGLE_REDIRECT_URI: String,
});

const oauth2Client = new google.auth.OAuth2(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_PASSWORD,
  env.GOOGLE_REDIRECT_URI
);

interface UserInfo {
  email: string;
  [key: string]: any;
}

class OAuthService {
  handleOAuthCallback = async (code: string | null): Promise<UserInfo> => {
    try {
      if (!code) {
        throw new CustomError(400, "Code not found.");
      }

      const { tokens } = await oauth2Client.getToken(code);

      oauth2Client.setCredentials(tokens);

      const response = await oauth2Client.request({
        url: "https://www.googleapis.com/oauth2/v3/userinfo",
      });

      if (response.status !== 200) {
        throw new CustomError(500, "Failed to fetch user Info");
      }

      return response.data as UserInfo;
    } catch (error) {
      throw error;
    }
  };

  createOAuthUrl = (req: Request): string => {
    const scopes = ["https://www.googleapis.com/auth/userinfo.email"];
    const state = crypto.randomBytes(32).toString("hex");
    req.session.state = state;
    return oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      include_granted_scopes: true,
      state,
      prompt: "consent",
    });
  };
  accessTokenService = (): string => {
    if (!oauth2Client.credentials.access_token) {
      throw new CustomError(401, "token not found");
    }

    return oauth2Client.credentials.access_token;
  };
}

export const oauthService = new OAuthService();
