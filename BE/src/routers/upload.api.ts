import express from "express";
import uploadController from "../controller/uploadController";

const router = express.Router();

router.post("/", uploadController.postGalleryUrl);

module.exports = router;
