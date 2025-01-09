import mongoose, { Schema, Types } from "mongoose";

interface Spouse {
  groom: string;
  bride: string;
}

export interface AccountSchema {
  _id: Types.ObjectId;
  name: Spouse;
  bankDetail: {
    bankname: Spouse;
    bankcode: Spouse;
    accountNumber: Spouse;
  };
}

/**
 * 금융 실명 조회 API는 사용불가
 *
 * 대안) FE에서 은행목록과 code 목데이터로 태그 제공하여 값을 전달
 * 계좌번호 verify는 X
 * **추후에 테스트 코드로 구현만
 *
 * 계좌 = 1계정 1계좌
 * 신랑 신부 계좌를 받은 하나의 1계좌 데이터
 * post는 여러개 되면 X
 */

const accountSchema = new Schema<AccountSchema>({
  name: {
    groom: {
      type: String,
    },
    bride: {
      type: String,
    },
  },
  bankDetail: {
    bankname: {
      groom: {
        type: String,
      },
      bride: {
        type: String,
      },
    },
    bankcode: {
      groom: {
        type: String,
      },
      bride: {
        type: String,
      },
    },
    accountNumber: {
      groom: {
        type: String,
      },
      bride: {
        type: String,
      },
    },
  },
});

const Account = mongoose.model<AccountSchema>("Account", accountSchema);

export default Account;
