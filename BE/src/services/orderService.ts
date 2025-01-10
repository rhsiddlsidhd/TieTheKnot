import { CustomError } from "../controller/oauthController";
import { OrderSchema } from "../models/orderSchema";

class OrderService {
  orderDataVerify = (data: OrderSchema): OrderSchema => {
    try {
      if (!data) {
        throw new CustomError(400, "req.body is undefined");
      }
      const {
        weddingAddress,
        weddingDate,
        account,
        parent,
        thumnail,
        gallery,
      } = data;

      if (!weddingAddress) {
        throw new CustomError(400, `웨딩홀 주소는 필수 입력입니다.`);
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

      if (!gallery) {
        throw new CustomError(
          400,
          `갤러리는 필수 입력입니다. 1가지 타입 이상 선택해주세요.`
        );
      }
      console.log("orderDataVerify :", account);

      return data;
    } catch (error) {
      throw error;
    }
  };
}

const orderService = new OrderService();

export default orderService;
