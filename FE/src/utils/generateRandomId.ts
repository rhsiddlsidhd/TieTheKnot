export const generateRandomId = () => {
  /**
   * 랜덤 Id 생성 => timestamp로 찍은이유
   * 상태 관리의 생성 순서 보장이 필요한데 랜덤Id string 의 순서 보장이 되지 않음
   * 고유의 ID + 순서 보장을 위하여 간단하게 timeStamp로 구현
   */
  return Date.now().toString();
};
