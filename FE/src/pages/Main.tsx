import React, { useState } from "react";
import styled from "styled-components";
import { media } from "../styles/media";
import "../App.css";
type CurrentDate = {
  year: number;
  month: number;
  date: number;
  day: number;
};

type CurrentTime = {
  hour: number | null;
  minutes: number | null;
  seconds: number | null;
};

const Main = () => {
  const today = new Date();

  const [currentDate] = useState<CurrentDate>({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    date: today.getDate(),
    day: today.getDay(),
  });

  const { year, month, date, day } = currentDate;

  const handleWeekdays = (day: number) => {
    let dayCopy = day;
    const weekdays = [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
      "일요일",
    ];
    return weekdays[dayCopy];
  };

  const weekdaysText = handleWeekdays(day);

  return (
    <div className="App">
      <Layout>
        <WeddingInvitationContainer>
          <MusicIconBox>음악아이콘</MusicIconBox>
          <SectionHeader $isfirstsection>
            <div>
              {year}/{month}/{date}
            </div>
            <div>{weekdaysText}</div>
          </SectionHeader>
          <ImgWrapper $thumnail>
            <img
              src={`${process.env.REACT_APP_IMAGE_BASE_URL}/married.jpg`}
              alt="이미지"
            />
          </ImgWrapper>
          <DetailInfoWrapper>
            <div>
              <span>오호호</span> 💚 <span>호호오</span>
            </div>
            <div>
              <span>2025년 06월 19일 토요일 오전 11시 30분</span>
              <span>다산 프리미엄 아울렛</span>
            </div>
          </DetailInfoWrapper>
        </WeddingInvitationContainer>
        <WeddingInvitationContainer>
          <SectionHeader>
            <p>Invitation</p>
            <h3>소중한 분들을 초대합니다</h3>
          </SectionHeader>
          <ContentWrapper>
            <div>
              Transition words are also called connection words that are used to
              interlink the ideas presented in one or more sentences, phrases,
              or paragraphs to form an organized thought process.
            </div>
            <p>-</p>
            <div>
              They can be used at the beginning, in the middle, or at the end of
              a sentence or paragraph. It can be used to maintain the continuity
              or change of ideas based on the context and tone of the text.
            </div>
            <div>
              오로지 믿음과 사랑을 약속하는 날<br /> 오셔서 축복해 주시면 더
              없는 기쁨으로
              <br /> 간직하겠습니다.
            </div>
          </ContentWrapper>
          <ImgWrapper>
            <img
              className="profile"
              src={`${process.env.REACT_APP_IMAGE_BASE_URL}/married.jpg`}
              alt="이미지"
            />
          </ImgWrapper>
          <ContentWrapper>
            <p>
              <span></span>
              <span>아버지</span>
              <span></span>
              <span>어머니</span>의 장녀 <span>아무나</span>
            </p>
            <p>
              <span></span>
              <span>아버지</span>
              <span></span>
              <span>어머니</span>의 장녀 <span>아무나</span>
            </p>
          </ContentWrapper>
          <BtnWrapper>
            <button>
              🗞️<span>연락하기</span>
            </button>
          </BtnWrapper>
        </WeddingInvitationContainer>
        <WeddingInvitationContainer>
          <SectionHeader>
            <p>INTERVIEW</p>
            <h3>우리 두 사람의 이야기</h3>
          </SectionHeader>
          <div>
            결혼을 앞두고 저희 두사람의
            <br /> 인터뷰를 준비했습니다.
          </div>
          <ImgWrapper>
            <img
              className="profile"
              src={`${process.env.REACT_APP_IMAGE_BASE_URL}/married.jpg`}
              alt="이미지"
            />
          </ImgWrapper>
          {/* 버튼 */}
          <BtnWrapper>
            <button>
              ✉️<span>신랑 & 신부의 인터뷰 읽어보기</span>
            </button>
          </BtnWrapper>
        </WeddingInvitationContainer>
        <WeddingInvitationContainer>
          <SectionHeader>
            <p>GALLERY</p>
            <h3>우리의 순간</h3>
          </SectionHeader>
          <GalleryWrapper>
            {}
            <img
              className="items item1"
              src={`${process.env.REACT_APP_IMAGE_BASE_URL}/married.jpg`}
              alt="이미지"
            />
            <img
              className="items item2"
              src={`${process.env.REACT_APP_IMAGE_BASE_URL}/married.jpg`}
              alt="이미지"
            />
            <img
              className="items item3"
              src={`${process.env.REACT_APP_IMAGE_BASE_URL}/married.jpg`}
              alt="이미지"
            />
          </GalleryWrapper>
        </WeddingInvitationContainer>
      </Layout>
    </div>
  );
};

export default Main;

const GalleryWrapper = styled.div`
  display: grid;
  width: 90%;
  /* grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: 8rem; */
  grid-gap: 1rem;
  padding: 1rem;
  grid-template-areas:
    "b a"
    "c a";
  border-radius: 0.5rem;
  & > .items {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0.5rem;
  }
  & > .item1 {
    grid-area: a;
  }
  & > .item2 {
    grid-area: b;
  }
  & > .item3 {
    grid-area: c;
  }
`;

const Layout = styled.div`
  max-width: 432px;
  width: 100%;
  background-color: #fafafa;
  text-align: center;
  /* padding: 1rem; */
  /* ${media.md`
    background-color: red;
    
  `}
  ${media.lg`
    background-color:  blue;
    `} */
`;

const WeddingInvitationContainer = styled.div`
  padding-top: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  padding-bottom: 2rem; //임의
  > .mb-3 {
    margin-bottom: 3rem;
  }
  &:first-child {
    padding-top: 0;
  }
`;

const MusicIconBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: end;
`;

const SectionHeader = styled.section<{ $isfirstsection?: boolean }>`
  color: ${(props) => (props.$isfirstsection ? "black" : "pink")};
  margin-bottom: ${(props) => (props.$isfirstsection ? "0" : "3rem")};
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImgWrapper = styled.div<{ $thumnail?: boolean }>`
  padding: 2rem 0;
  width: ${(props) => (props.$thumnail ? "100%" : "80%")};
  height: ${(props) => (props.$thumnail ? "auto" : "20rem")};

  & > img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    border-radius: 1rem;
  }
  & > .profile {
    border-radius: 1rem;
  }
`;

const DetailInfoWrapper = styled.div`
  width: 80%;
  > div {
    display: flex;
    justify-content: center;
  }
  > div:last-child {
    flex-direction: column;
    padding-top: 1rem;
  }
`;

const ContentWrapper = styled.div`
  width: 80%;
  margin-bottom: 1rem;
  > div {
    padding: 1rem 0;
  }
  > p > span {
    font-size: 1.25rem;
  }
`;

const BtnWrapper = styled.div`
  width: 80%;
  & > button {
    width: 100%;
    padding: 0.5rem 2rem;
    border-radius: 0.5rem;
    border: 2px solid #f0f0f0;
    background-color: white;
  }
  & > button:hover {
    cursor: pointer;
  }
`;
