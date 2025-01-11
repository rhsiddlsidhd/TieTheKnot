import { Account, Gallery, Parent } from "../../pages/Order";
import { createMaxLengthUrls } from "../urlUtils";
//주소 유효성 검사
const weddingAddressValidator = (address: string): string => {
  if (!address) {
    throw new Error("웨딩홀 주소는 필수 입력입니다.");
  }
  return address;
};
//날짜 유효성 검사
const weddingDateValidator = (date: string): string => {
  if (!date) {
    throw new Error("웨딩 날짜, 시간은 필수 입력입니다.");
  }
  return date;
};

//계좌 유효성 검사
const weddingAccountValidator = (account: Account[]): Account[] => {
  if (Array.isArray(account) && account.length > 0) {
    account.forEach((item) => {
      const { name, bankName, accountNumber } = item;
      if (!name || !bankName || !accountNumber) {
        throw new Error("계좌 명의, 은행명, 은행 계좌 필수 입력입니다.");
      }
    });
  }

  return account;
};

//혼주 유효성 검사사
const weddingParentValidator = (parent: Parent[]): Parent[] => {
  if (Array.isArray(parent) && parent.length > 0) {
    parent.forEach((item) => {
      const { badge, name } = item;
      if (!badge || !name) {
        throw new Error("혼주의 태그 및 성함은 필수 입력입니다.");
      }
    });
  }

  return parent;
};

//썸네일 유효성 검사사
const weddingThumnail = (thumnail: string[]): string[] => {
  if (!thumnail || !Array.isArray(thumnail)) {
    throw new Error("썸네일은 필수 입력입니다.");
  }

  if (thumnail.length !== 2) {
    throw new Error("썸네일은 2장의 이미지 URL을 필요로 합니다.");
  }

  return thumnail;
};
//갤러리 유효성 검사사
const weddingGallery = (gallery: Gallery): Gallery => {
  if (!gallery) {
    throw new Error("잡히나 ?");
  }

  if (Object.keys(gallery).length === 0) {
    throw new Error("갤러리는 하나 이상 타입 필수 입력입니다.");
  }

  for (const value of Object.values(gallery)) {
    const length = createMaxLengthUrls(value.type);
    if (value.urls.length !== length) {
      throw new Error(
        `${value.type}타입(${length})에 따른 이미지를 등록하셔야 합니다 `
      );
    }
  }

  return gallery;
};

const orderDataValidator = {
  weddingAddressValidator,
  weddingDateValidator,
  weddingAccountValidator,
  weddingParentValidator,
  weddingThumnail,
  weddingGallery,
};

export default orderDataValidator;
