import { CustomError } from "../controller/oauthController";
import { Request, Response } from "express";
import crypto from "crypto";
import { oauth2Client } from "../config/oauthConfig";
import fetch from "node-fetch";
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

class OAuthService {
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

  handleOAuthCallback = async (code: string | null, res: Response) => {
    try {
      if (!code) {
        throw new CustomError(400, "Code not found.");
      }

      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      return tokens;
    } catch (error) {
      throw error;
    }
  };

  fetchUserInfo = async (): Promise<UserInfo> => {
    try {
      const response = await oauth2Client.request({
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
    accessToken: string,
    res: Response
  ): Promise<void> => {
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
      const url = `https://oauth2.googleapis.com/tokeninfo?access_token=${jwt}`;
      const response = await fetch(url);

      if (response.status === 401) {
        //만료된토큰
        return false;
      } else if (response.status !== 200) {
        throw new CustomError(response.status, response.statusText);
      }

      return true;
    } catch (error) {
      throw error;
    }
  };

  refreshAccessToken = async (res: Response): Promise<boolean> => {
    oauth2Client.on("tokens", (tokens) => {
      res.cookie("__knot_jwt", `bearer ${tokens.access_token}`, {
        path: "/",
        maxAge: 3600000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
    });
    return true;
  };
}

export const oauthService = new OAuthService();
