import { authenticate } from "../middlewear/authenticate";
const express = require("express");
const router = express.Router();
const authApi = require("../routers/auth.api");
const userApi = require("../routers/user.api");
const accountApi = require("../routers/account.api");
const orderApi = require("./order.api");

router.use("/auth", authApi);
router.use("/user", authenticate, userApi);
router.use("/account", accountApi);
router.use("/order", orderApi);

module.exports = router;
