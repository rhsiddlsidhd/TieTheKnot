import express = require("express");
import { oauthController } from "../controller/oauthController";

const router = express.Router();

/**
 * 로그인 및 회원가입 (완)
 * 로그아웃 (미)
 * 계정삭제 (미)
 */

router.get("/", oauthController.getGoogleOAuth);

router.get("/google", oauthController.googleOAuthCallback);

router.get("/authenticate", oauthController.getAuthenticationStatus);

module.exports = router;
