import { CustomError } from "../controller/oauthController";
import { Request, Response } from "express";
import crypto from "crypto";
import { google } from "googleapis";
import { load } from "ts-dotenv";
import fetch from "node-fetch";
import { OAuth2Client } from "google-auth-library";
var url = require("url");
/**
 * google Social Login
 * OAuth2.0 라이브러리 사용
 *  redirect url 이후 code 발급 및 code를 바탕으로 tokens 추출 (완)
 *  accesstoken이 발급되면 http-only 쿠키로 accesstoken 저장 (완)
 *  ! 현재 서버가 재시작 되면 Oauth2.0client는 token이 없으나 웹은 기존 저장된 accesstoken은 쿠키에 남아 있음
 * (클라이언트는 단순 쿠키 유무가 아닌 토큰의 유효성을 검증해서 유효한 경우에만 로그인처리) (완)
 *
 *  인증 미들웨어
 * ! oauth2.0client node-fetch ()
 * req.cookie에서 토큰을 가져와서 oauth2.0clien 토큰 유효성 체크
 * 만료시에는 두가지 경우 고려
 * 1. 유저가 로그인 된 상태로 만료가 된 상황 (req.cookie 에 토큰이 있는 경우)
 * oauth2.0cline.on 으로 accessToken 재발급 및 쿠키 재저장
 * 2. 유저가 로그아웃 한 경우 (req.cookie에 토큰이 없는 경우우)
 * 유저가 로그아웃을 하면 쿠키에 있는 accessToken 삭제
 * req.cookie 에 토큰이 없을 경우에는 oauth2.0client token 삭제
 */

interface UserInfo {
  email: string;
  [key: string]: any;
}

const env = load({
  GOOGLE_CLIENT_ID: String,
  GOOGLE_CLIENT_PASSWORD: String,
  GOOGLE_REDIRECT_URI: String,
});

class OAuthService {
  private oauth2Client: OAuth2Client;
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_PASSWORD,
      env.GOOGLE_REDIRECT_URI
    );
  }

  createOAuthUrl = (req: Request): string => {
    const scopes = ["https://www.googleapis.com/auth/userinfo.email"];
    const state = crypto.randomBytes(32).toString("hex");
    req.session.state = state;
    return this.oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      include_granted_scopes: true,
      state,
      prompt: "consent",
    });
  };

  handleOAuthCallback = async (req: Request, res: Response) => {
    try {
      if (!req.url) {
        throw new Error(`url is ${typeof req.url}`);
      }
      let q = url.parse(req.url, true).query;

      const { error, state, code } = q;
      let session = req.session;
      if (error) {
        throw new CustomError(400, q.error);
      }

      if (state !== session.state) {
        throw new CustomError(403, "State mismatch. Possible CSRF attack.");
      }

      if (!code) {
        throw new CustomError(400, "Code not found.");
      }

      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);

      return tokens;
    } catch (error) {
      throw error;
    }
  };

  fetchUser = async (): Promise<UserInfo> => {
    try {
      const response = await this.oauth2Client.request({
        url: "https://www.googleapis.com/oauth2/v3/userinfo",
      });

      if (response.status !== 200) {
        throw new CustomError(response.status, response.statusText);
      }

      return response.data as UserInfo;
    } catch (error) {
      throw error;
    }
  };

  setAccessTokenToCookie = async (
    accessToken: string | undefined | null,
    res: Response
  ): Promise<void> => {
    if (!accessToken) {
      throw new Error("Invalid or Missing access token");
    }

    if (accessToken) {
      res.cookie("__knot_jwt", `bearer ${accessToken}`, {
        path: "/",
        maxAge: 3600000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
    }
  };

  accessTokenVerify = async (jwt: string) => {
    try {
      /**
       * 문제점
       * 토큰은 유효하지만 특정 유저 access토큰 인지는 검증하지 않음
       */
      if (!jwt) {
        throw new CustomError(400, `JWT is ${typeof jwt}`);
      }
      const clientAccess = this.oauth2Client.credentials.access_token;

      if (jwt !== clientAccess) {
        throw new CustomError(401, "Invalid jwt");
      }

      const url = `https://oauth2.googleapis.com/tokeninfo?access_token=${jwt}`;
      const response = await fetch(url);

      if (response.status === 401) {
        return false;
      } else if (response.status !== 200) {
        throw new CustomError(response.status, response.statusText);
      }

      return true;
    } catch (error) {
      throw error;
    }
  };

  refreshAccessToken = async (res: Response): Promise<void> => {
    this.oauth2Client.on("tokens", (tokens) => {
      res.cookie("__knot_jwt", `bearer ${tokens.access_token}`, {
        path: "/",
        maxAge: 3600000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
    });
  };
}

export const oauthService = new OAuthService();
