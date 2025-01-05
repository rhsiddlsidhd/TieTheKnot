import { NextFunction, Request, Response } from "express";
import { oauth2Client } from "../config/oauthConfig";
import { CustomError } from "../controller/oauthController";
import { oauthService } from "../services/oauthService";

/**
 * 토큰 유무가 필요한 API
 * 미들웨어로 const jwt = req.cookies.__knot_jwt.split(" ")[1]; 체크
 * 유효성 검사 
 * 1. 유효한 경우 > next()
 * 2. 만료된 경우 >  DB user 테이블 refeshtoken 를 가져와서 갱신
 * 만료된 accesstoken으로 user를 특정할 수 없음
 * 
 * OAuth2client에 이미 token이 저장되어 내장 메서드로 갱신 가능하여 우회
 *  oauth2Client.on('tokens', (tokens) => {
 if (tokens.refresh_token) {
    // store the refresh_token in your secure persistent database
    console.log(tokens.refresh_token);
  }
  console.log(tokens.access_token);
});
 * 3. 토큰은 존재하지만 유효하지 않은 경우, 토큰이 없는 경우 > throw error
 */

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.cookies.__knot_jwt) {
      throw new CustomError(400, "Bad request");
    }

    const jwt = req.cookies.__knot_jwt.split(" ")[1];

    const tokenVarify = await oauthService.accessTokenVerify(jwt);
    if (tokenVarify) {
      next();
    } else {
      //재발급
      await oauthService.refreshAccessToken(res);
      next();
    }
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.status).json({
        name: error.name,
        message: error.message,
      });
    } else {
      console.error(error);
    }
  }
};
