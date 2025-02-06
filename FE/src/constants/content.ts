interface Quote {
  quote: string;
  author: string;
}
type Quotes = Quote[];

export const quotes: Quotes = [
  {
    quote: `결혼은 원석을 만나 그 원석을 \n 나로 하여금 보석으로 \n 만들어가는 과정이라고 생각한다.
    `,
    author: `- 션 sns 中`,
  },
];

export const invitationMessage: {
  introdution: string;
  invitation: string;
  request: string;
} = {
  introdution: `서로 다른 삶을 살아온 두 사람이 \n 이제는 믿음의 결실을 맺어 같은 길을 걸어가고자 합니다.`,
  invitation: `두 사람이 믿음의 결실을 맺는데 \n 소중한 분들을 모시고자 합니다.`,
  request: `새로운 인생을 시작하는 두 사람에게 \n 귀한 걸음으로 오셔서 축복해 주신다면 감사하겠습니다.`,
};
