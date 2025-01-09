import express from "express";
import { userController } from "../controller/userController";

const router = express.Router();
/**
 * 상세정보등록
 * 개선안 >> 1계정 1상세정보이며
 * 유저의 상세정보가 있다면 등록하기 페이지 접근권한을 막아야한다.
 * 다만, 현재 소셜로그인으로 바로 회원가입을 받으면서 로그인을
 * 진행하고 있으며 이는 등록하기 페이지를 따로 구현하지 않도록
 * 회원가입시에 user-detail-info 필드 생성 필드값은 null setup
 * user-detail-info 업데이트 형식으로 상세 정보 등록 (완)
 *
 * 상세정보가져오기
 * 유저가 상세정보 페이지 들어왔을때 DB에 저장되어 있는 값을
 * 모두 보여줄 수 있도록 user-datail-info Get (완)
 */
router.get("/detail", userController.getDetailInfo);
router.patch("/detail", userController.putDetailInfo);
/**
 * 상세정보수정
 * 내 상세정보는 1계정 1상세정보
 * 유효한 토큰 O => 토큰으로 유저 특정 상세정보를 가져오기
 * 새로 전달된 데이터 => 유저 상세정보로 저장하기 (완)
 */

module.exports = router;
