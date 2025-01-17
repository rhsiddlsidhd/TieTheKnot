import styled from "styled-components";
import { media } from "../styles/media";
import "../App.css";
import MapSections from "../components/locations/MapSections";
import { convertToAMPM } from "../utils/dateUtils";
import Calender from "../components/calenders/CalenderSections";
import CountdownSections from "../components/calenders/CountdownSections";
import SubwaySections from "../components/locations/SubwaySections";
import BusSections from "../components/locations/BusSections";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { GeoProps } from "../apis/api/location/kakaoMap/types";
import NaviSections from "../components/locations/NaviSections";
import PrivateCarSections from "../components/locations/PrivateCarSections";
import axios from "axios";
import { WeddingDataAPI } from "../context/UserOrderDataContext";
import { OrderFormData } from "./Order";
import GuestBook from "../components/guestbook/GuestBook";

export interface WeddingDay {
  year: number;
  month: number;
  date: number;
  day: number;
}

type GalleryType = {
  [key: string]: {
    urls: string[];
    type: string;
  };
};
const Main = () => {
  const [visible, setVisible] = useState<
    [string, { type: string; urls: string[] }][]
  >([]);
  const [parent, setParent] = useState<
    Record<string, { name: string; isDeceased: string }>
  >({});
  const [isMoreVisible, setIsMoreVisible] = useState<boolean>(false);
  const [galleryTypeData, setGalleryTypeData] = useState<GalleryType | null>(
    null
  );
  const value = useContext(WeddingDataAPI);

  const { weddingData, setWeddingData } = value;

  const newDate = new Date(
    weddingData ? weddingData.weddingDate : "0000-00-00 00:00"
  );

  const [currentGeoState, setCurrentGeoState] = useState<GeoProps>({
    lng: null,
    lat: null,
  });
  const [geoState, setGeoState] = useState<GeoProps>({
    lng: null,
    lat: null,
  });

  useEffect(() => {
    const fetchUserOrderData = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/order`, {
          withCredentials: true,
        });
        const data = res.data;
        setWeddingData(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserOrderData();
  }, [setWeddingData]);

  const convertGridAreaType = (s: string[][]) => {
    let n = "";

    s.forEach((v, i) => {
      n += `"${v.join(" ")}"${"\n"}`;
    });

    return n;
  };
  const transformGalleryWithType = useCallback(
    (weddingData: OrderFormData): void => {
      const galleryType = {
        A: {
          quantity: 3,
          type: [
            ["a", "b"],
            ["a", "c"],
          ],
        },
        B: {
          quantity: 3,
          type: [
            ["b", "a"],
            ["c", "a"],
          ],
        },
        C: {
          quantity: 4,
          type: [
            ["a", "b"],
            ["a", "c"],
            ["d", "c"],
          ],
        },
        D: {
          quantity: 4,
          type: [
            ["a", "b"],
            ["d", "b"],
            ["d", "c"],
          ],
        },
        E: {
          quantity: 5,
          type: [
            ["a", "b"],
            ["a", "c"],
            ["d", "c"],
            ["d", "e"],
          ],
        },
        F: {
          quantity: 5,
          type: [
            ["a", "b"],
            ["c", "b"],
            ["c", "d"],
            ["e", "d"],
          ],
        },
        G: {
          quantity: 6,
          type: [
            ["a", "b"],
            ["c", "d"],
            ["c", "d"],
            ["e", "f"],
          ],
        },
      };

      Object.entries(weddingData.gallery).forEach(([id, items]) => {
        if (items.type) {
          const type = galleryType[items.type as keyof typeof galleryType].type;
          const convertedType = convertGridAreaType(type);
          let result = {
            [id]: { urls: items.urls, type: convertedType },
          };

          setGalleryTypeData((prev) => {
            if (prev === null) {
              return { ...result };
            }
            return { ...prev, ...result };
          });
        }
      });
    },
    []
  );

  useEffect(() => {
    if (weddingData) {
      transformGalleryWithType(weddingData);
    }
  }, [weddingData, transformGalleryWithType]);

  useEffect(() => {
    if (galleryTypeData && Object.entries(galleryTypeData).length > 1) {
      const item = Object.entries(galleryTypeData).slice(0, 1);
      setVisible((prev) => {
        const newItems = item.filter(
          ([key]) => !prev.some(([prevKey]) => prevKey === key)
        );
        return [...prev, ...newItems];
      });
    }
  }, [galleryTypeData]);

  const transformParentData = (data: any[]) => {
    return data.reduce((result, item) => {
      result[item.badge] = {
        name: item.name,
        isDeceased: item.isDeceased,
      };
      return result;
    }, {});
  };

  useEffect(() => {
    if (weddingData) {
      setParent(transformParentData(weddingData.parent));
    }
  }, [weddingData]);
  if (!weddingData) {
    return <div>로딩중...</div>;
  }

  const weddingDay = {
    year: newDate.getFullYear(),
    month: newDate.getMonth() + 1,
    date: newDate.getDate(),
    day: newDate.getDay(),
  };

  const weddingTime = {
    hours: newDate.getHours(),
    minutes: newDate.getMinutes(),
  };

  const { year, month, date, day } = weddingDay;
  const { hours, minutes } = weddingTime;

  const weekdaysOfKr = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];

  const weekdaysOfEng = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let time = convertToAMPM(hours, minutes);

  const handleIsMoreVisible = (
    galleryTypeData: GalleryType,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    setIsMoreVisible(true);
    const items = Object.entries(galleryTypeData).slice(1);

    setVisible((prev) => [...prev, ...items]);
  };

  //더보기 버튼

  //렌더가 된 div 이후에 높이가 계산이 되서

  //현재 boolean을 올바로 가져오질 못하게 됨으로써 더보기 버튼이 렌더이후에 없음

  //(수정안)checkOverFlow 의존성에 weddingData가 들어오면 렌더할 수 있도록 의존성 추가
  return (
    <div className="App">
      <Layout>
        <WeddingInvitationContainer>
          <MusicIconBox>음악아이콘</MusicIconBox>
          <SectionHeader $isfirstsection>
            <div>
              {year}/{month}/{date}
            </div>
            <div>{weekdaysOfEng[day]}</div>
          </SectionHeader>
          <ImgWrapper $thumnail>
            <img
              src={`http://localhost:8080/upload/${weddingData.thumnail[0]}`}
              alt="이미지"
            />
          </ImgWrapper>
          <DetailInfoWrapper>
            <div>
              <span>{weddingData.name.groom}</span> 💚{" "}
              <span>{weddingData.name.bride}</span>
            </div>
            <div>
              <span>
                {year}년 {month}월 {date}일{`${weekdaysOfKr[day]} ${time}`}
              </span>
              <span>{weddingData.weddingAddressDetail}</span>
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
              결혼은 원석을 만나 그 원석을 <br />
              나로 하여금 보석으로 만들어가는 <br />
              과정이라고 생각한다.
            </div>
            <p>-션 SNS 中</p>
            <div>
              서로 다른 삶은 살아온 두 사람이
              <br /> 이제는 믿음의 결실을 맺어
              <br /> 같은 길을 걸어가고자 합니다.
              <br />
              <br />
              두 사람이 믿음의 결실을 맺는데 <br /> 소중한 분들을 모시고자
              합니다.
              <br />
              <br />
              새로운 인생을 시작하는
              <br /> 두 사람에게
              <br /> 귀한 걸음으로 오셔서 축복해 주신다면 <br />
              감사하겠습니다.
            </div>
          </ContentWrapper>
          <ImgWrapper>
            <img
              className="profile"
              src={`http://localhost:8080/upload/${weddingData.thumnail[1]}`}
              alt="이미지없음"
            />
          </ImgWrapper>
          <ContentWrapper>
            {/* 부모님 여부 부/ 모 구분이 없다 추가해야함  */}
            {/* {Array.isArray(weddingData.parent) &&
            weddingData.parent.length > 0 ? (
              weddingData.parent.map((items) => {
                const { badge, name, isDeceased } = items;
                return <p>{<span>{items.name}</span>}</p>;
              })
            ) : (
              <div>로딩중</div>
            )} */}

            {parent && (
              <p>
                <span>{parent["신랑측 부"]?.isDeceased && "𐠦"}</span>
                <span>{parent["신랑측 부"]?.name}</span>
                <span>{parent["신랑측 모"]?.isDeceased && "𐠦"}</span>
                <span>{parent["신랑측 모"]?.name}</span>
                <span>의 장남 {weddingData.name.groom}</span>
              </p>
            )}
            {parent && (
              <p>
                <span>{parent["신부측 부"]?.isDeceased && "𐠦"}</span>
                <span>{parent["신부측 부"]?.name}</span>
                <span>{parent["신부측 모"]?.isDeceased && "𐠦"}</span>
                <span>{parent["신부측 모"]?.name}</span>
                <span>의 장녀 {weddingData.name.bride}</span>
              </p>
            )}
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
              src={`http://localhost:8080/upload/${weddingData.thumnail[0]}`}
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
          <SectionContent $isMoreVisible={isMoreVisible}>
            {visible ? (
              visible.map(([id, value], i) => {
                const type = value.type;
                return (
                  <GalleryWrapper key={i} id={id} $gridTemplateAreas={type}>
                    {Array.isArray(value.urls) ? (
                      value.urls.map((url, i) => {
                        const letter = String.fromCharCode(97 + i);
                        return (
                          <img
                            key={i}
                            className={`items item${i + 1}`}
                            src={`http://localhost:8080/upload/${url}`}
                            alt="이미지"
                            style={{ gridArea: letter }}
                          />
                        );
                      })
                    ) : (
                      <div>로딩중</div>
                    )}
                  </GalleryWrapper>
                );
              })
            ) : (
              <div>로딩중</div>
            )}
            {galleryTypeData && Object.keys(galleryTypeData).length > 2 && (
              <VisibleBtn
                $isMoreVisible={isMoreVisible}
                onClick={(e) => handleIsMoreVisible(galleryTypeData, e)}
              ></VisibleBtn>
            )}
          </SectionContent>
          <CalendarWrapper>
            <h1>{`${year}.${month}.${date}`}</h1>
            <h3
              style={{ fontWeight: "100" }}
            >{`${weekdaysOfKr[day]} ${time}`}</h3>
            <Calender weddingDay={weddingDay} weekdaysOfKr={weekdaysOfKr} />
            <CountdownSections />
          </CalendarWrapper>
        </WeddingInvitationContainer>
        <WeddingInvitationContainer>
          <SectionHeader>
            <p>Location</p>
            <h3>오시는 길</h3>
          </SectionHeader>
          <section>
            <div>{weddingData.weddingAddressDetail}</div>
            <div>{weddingData.weddingAddress}</div>
          </section>
          <MapSections
            currentGeoState={currentGeoState}
            geoState={geoState}
            setCurrentGeoState={setCurrentGeoState}
            setGeoState={setGeoState}
          />
          <NaviSections currentGeoState={currentGeoState} geoState={geoState} />
          <SubwaySections />
          <BusSections geoState={geoState} />
          <PrivateCarSections />
        </WeddingInvitationContainer>
        <GuestBook _id={weddingData._id} />
      </Layout>
    </div>
  );
};

export default Main;
const SectionContent = styled.div<{ $isMoreVisible: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 5rem;
`;

const VisibleBtn = styled.button<{ $isMoreVisible: boolean }>`
  width: 100%;
  height: 100px;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1;
  border: none;
  background: linear-gradient(to bottom, transparent 0%, white 30%, white 100%);
  opacity: ${(props) => (props.$isMoreVisible ? 0 : 1)};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover::before {
    content: "↑";
    border-radius: 10px;
    padding: 0.25rem 0.65rem;
    transform: rotate(180deg);
    transition: transform 0.5s ease-out;
  }

  &::before {
    content: "•••";
    padding: 0 0.5rem 0.5rem 0.5rem;
    border-radius: 10px;
  }
`;

const CalendarWrapper = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
`;

const GalleryWrapper = styled.div<{ $gridTemplateAreas: string }>`
  display: grid;
  width: 90%;
  grid-gap: 1rem;
  padding: 1rem;
  grid-template-areas: ${({ $gridTemplateAreas }) => $gridTemplateAreas};
  border-radius: 0.5rem;
  & > .items {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0.5rem;
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

export const WeddingInvitationContainer = styled.div`
  padding-top: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;

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

export const SectionHeader = styled.section<{ $isfirstsection?: boolean }>`
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

export const BtnWrapper = styled.div<{ nav?: boolean }>`
  width: 80%;
  & > button {
    width: 100%;
    padding: 0.5rem 2rem;
    border-radius: 0.5rem;
    border: 2px solid #f0f0f0;
    background-color: white;
    font-family: "Cute Font", sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0.5rem 0;
  }
  & > button:hover {
    cursor: pointer;
  }
`;
