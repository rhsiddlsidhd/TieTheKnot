import express from "express";
import { accountContoroller } from "../controller/accountController";

const router = express.Router();
/**
 * account CRUD
 *
 * REST API 설계
 *  1. URI는 동사보다는 명사를, 대문자보다는 소문자를 사용하여야 한다.
 *  2. 마지막에 슬래시 (/)를 포함하지 않는다.
 *  3. 언더바 대신 하이폰을 사용한다.
 *  4. 파일확장자는 URI에 포함하지 않는다.
 *  5. 행위를 포함하지 않는다.
 * 계좌 조회
 * 계좌 등록
 * 계좌 수정
 * 계좌 삭제
 */

router.post("/", accountContoroller.postAccountInfo);

module.exports = router;
