import guestBookController from "../controller/guestbookController";

const express = require("express");

const router = express.Router();

router.post("/", guestBookController.postGuestbook);
router.delete("/", guestBookController.deleteGuestBook);
router.get("/", guestBookController.getTotalGuestbook);

module.exports = router;
