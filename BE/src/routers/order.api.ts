import express from "express";
import { orderController } from "../controller/orderController";

const router = express.Router();

/**
 * 주문보기
 * 주문하기
 * 주문수정하기
 * 주문취소하기
 */

router.post("/", orderController.postWeddingOrder);
router.get("/", orderController.getWeddingOrder);

module.exports = router;
