import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Tset = () => {
  const [count, setCount] = useState(0);
  const [galleryType, setGalleryType] = useState<string>("");
  /**
   * count Type을 하나의 객체로 받아서 상태관리 해야함
   *
   */

  const [galleryId, setGalleryId] = useState<string[]>([]);
  const [toggleDropdown, setToggleDropdown] = useState<boolean[]>([]);
  const [selectedGalleryTypeId, setSelectedGalleryTypeId] =
    useState<String>("");

  //이중배열

  const imgType = {
    a: {
      quantity: 3,
      type: [
        ["a", "b"],
        ["a", "c"],
      ],
    },
    b: {
      quantity: 3,
      type: [
        ["b", "a"],
        ["c", "a"],
      ],
    },
    c: {
      quantity: 4,
      type: [
        ["a", "b"],
        ["a", "c"],
        ["d", "c"],
      ],
    },
  };
  type ImgTypeKey = keyof typeof imgType;

  // A 타입은 이미지 2개
  // B 타입은 이미지 3개
  // C 타입은 이미지 4개

  const typeConvert = (s: string[][]) => {
    let n = "";

    s.forEach((v, i) => {
      n += `"${v.join(" ")}"${"\n"}`;
    });

    return n;
  };

  const handleTypeValue = (id: String, e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    const value = target.getAttribute("value");

    setSelectedGalleryTypeId(id);

    /**
     * 클릭시 dropdown 아이디와 갤러리 아이디가 일치한 것만 데이터 전달달
     * 여기에서 id 와 components id를 받아와야하네 ? ㅡ.ㅡ ;;
     */
    if (value) {
      const typeObj = JSON.parse(value);
      const { quantity, type } = typeObj;

      setCount(quantity);
      if (type) {
        let $type = typeConvert(type);
        setGalleryType($type);
      }
    }
  };

  function solution(a: typeof imgType): ImgTypeKey[] {
    const result: ImgTypeKey[] = [];
    for (const key in a) {
      result.push(key as ImgTypeKey);
    }
    return result;
  }

  const galleryCountFn = () => {
    /**
     * + 버튼 클릭시 랜덤 ID 생성 및 idArray.push(randomId)
     * idArray.length 만큼 drop 및 gallery 뿌려주기
     */
    let galleryId = generateRandomId();
    setGalleryId((prev) => [...prev, galleryId]);
  };

  useEffect(() => {
    //갤러리 아이디 만큼 boolean 값으로 된 배열을 추가해야함
    if (galleryId.length !== 0) {
      setToggleDropdown((prev) => [...prev, false]);
    }
  }, [galleryId]);

  const imgTypeArray: ImgTypeKey[] = solution(imgType);

  const generateRandomId = () => {
    let id = "";
    const length = 12;
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
      id += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return id;
  };

  const handleDropdown = (index: Number, e?: React.MouseEvent<HTMLElement>) => {
    setToggleDropdown((prev) =>
      prev.map((open, i) => (i === index ? !open : open))
    );
  };

  return (
    <div style={{ padding: "1rem" }}>
      <button style={{ padding: "1rem" }} onClick={galleryCountFn}>
        plus
      </button>
      <h1>갤러리 카운트 {galleryId.length}</h1>
      {Array.from({ length: galleryId.length }, (_, i) => {
        return (
          <Drop className={galleryId[i]}>
            {/* 드롭에 현재 id가 다 다르니 일치한것만 open 하고 나머지는 close */}
            {/* <div onClick={() => setIsOpen((prevState) => !prevState)}> */}
            <div onClick={() => handleDropdown(i)}>
              {toggleDropdown[i] ? "on" : "off"}
            </div>
            {toggleDropdown[i] && (
              <ul
                onClick={(e) => handleTypeValue(galleryId[i], e)}
                style={{ listStyle: "none" }}
              >
                {imgTypeArray.map((v, i) => {
                  const value = JSON.stringify(imgType[v]);
                  return (
                    <li key={i} value={value}>
                      {i + 1}
                    </li>
                  );
                })}
              </ul>
            )}
          </Drop>
        );
      })}
      <div>갤러리 items {count}</div>
      {Array.from({ length: galleryId.length }, (_, i) => {
        return (
          <GridContainer galleryType={galleryType} className={galleryId[i]}>
            {Array.from({ length: count }, (_, i) => {
              const letter = String.fromCharCode(97 + i);
              return (
                <img
                  key={i}
                  className={`items item${i + 1}`}
                  src={`${process.env.REACT_APP_IMAGE_BASE_URL}/married.jpg`}
                  alt="이미지"
                  style={{ gridArea: letter }}
                />
              );
            })}
          </GridContainer>
        );
      })}
    </div>
  );
};

export default Tset;

const Drop = styled.div`
  border: 1px solid black;
  & > ul > li {
    border-bottom: 1px solid black;
    cursor: pointer;
    &:hover {
      background-color: gray;
    }
  }
`;
const GridContainer = styled.div<{ galleryType: string }>`
  display: grid;
  width: 90%;
  border: 1px solid red;
  /* grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: 8rem; */
  grid-auto-rows: 8rem;
  grid-template-areas: ${({ galleryType }) => galleryType};
  grid-gap: 1rem;
  padding: 1rem;
  & > img {
    border: 1px solid black;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

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
