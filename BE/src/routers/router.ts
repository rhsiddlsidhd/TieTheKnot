import { authenticate } from "../middlewear/authenticate";
const express = require("express");
const router = express.Router();
const authApi = require("../routers/auth.api");
const userApi = require("../routers/user.api");

router.use("/auth", authApi);
router.use("/user", authenticate, userApi);

module.exports = router;
