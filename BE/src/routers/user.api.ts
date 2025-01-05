import express from "express";
const router = express.Router();

router.get("/k", (req, res) => {
  res.send("hello world");
});

module.exports = router;
