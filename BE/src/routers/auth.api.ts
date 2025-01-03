import express = require("express");
import { oauthController } from "../controller/userController";

const router = express.Router();

router.get("/", oauthController.getGoogleOAuth);

router.get("/google", oauthController.googleOAuthCallback);

router.get("/token", oauthController.getAccessToken);

module.exports = router;
