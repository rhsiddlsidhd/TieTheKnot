import express = require("express");
import { oauthController } from "../controller/oauthController";

const router = express.Router();

router.get("/", oauthController.getGoogleOAuth);

router.get("/google", oauthController.googleOAuthCallback);

router.get("/authenticate", oauthController.getAuthenticationStatus);

module.exports = router;
