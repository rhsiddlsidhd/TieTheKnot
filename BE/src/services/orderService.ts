import { CustomError } from "../controller/oauthController";
import { OrderSchema } from "../models/orderSchema";

class OrderService {
  orderDataVerify = (data: OrderSchema): OrderSchema => {
    try {
      if (!data) {
        throw new CustomError(400, "req.body is undefined");
      }
      const {
        name,
        weddingAddress,
        weddingDate,
        weddingAddressDetail,
        account,
        parent,
        thumnail,
        gallery,
      } = data;

      if (!name) {
        throw new CustomError(400, `신랑, 신부 성함은 필수 입력입니다.`);
      }
      if (!weddingAddress) {
        throw new CustomError(400, `웨딩홀 주소는 필수 입력입니다.`);
      }

      if (!weddingAddressDetail) {
        throw new CustomError(400, `웨딩홀 상세 주소는 필수 입력입니다.`);
      }

      if (!weddingDate) {
        throw new CustomError(400, `웨딩 날짜, 시간은 필수 입력입니다.`);
      }

      if (thumnail.length !== 2) {
        throw new CustomError(
          400,
          `썸네일은 필수 입력입니다. 총 두장을 선택해주세요.`
        );
      }

      if (Object.keys(gallery).length === 0) {
        throw new CustomError(
          400,
          `갤러리는 필수 입력입니다. 1가지 타입 이상 선택해주세요.`
        );
      }
      const entries =
        gallery instanceof Map ? [...gallery] : Object.entries(gallery);
      for (const [key, value] of entries) {
        if (!value.urls || value.urls.length === 0) {
          throw new CustomError(
            400,
            `갤러리 타입에 맞는 이미지 URL 수량은 필수 입력입니다.`
          );
        }
      }

      return data;
    } catch (error) {
      throw error;
    }
  };
}

const orderService = new OrderService();

export default orderService;
