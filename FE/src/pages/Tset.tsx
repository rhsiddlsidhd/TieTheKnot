import React, { useState } from "react";
import styled from "styled-components";

type Count = Number;
interface GalleryType {
  type: string;
}

const Tset = () => {
  const [count, setCount] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const [galleryType, setGalleryType] = useState<string>("");

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
        ["c", "d"],
      ],
    },
  };

  // A 타입은 이미지 2개
  // B 타입은 이미지 3개
  // C 타입은 이미지 4개

  //   const typeConvert = (s: string[][]) => {

  //     let n = "";

  //     // 2차원 배열을 순차적으로 처리
  //     s.forEach((row) => {
  //       // 각 행의 요소들을 공백으로 구분하여 추가
  //       n += `"${row.join(" ")}"${"\n"}`;
  //     });

  //     console.log(n); // 결과 출력
  //     return n; // 결과 반환
  //   };

  // const typeConvert = (s: string[][]) => {
  //     let n = "";

  //     // 2차원 배열을 순차적으로 처리
  //     s.forEach((row) => {
  //       // 각 행의 요소들을 공백으로 구분하여 추가
  //       n += `"${row.join(" ")}"${"\n"}`;
  //     });

  //     console.log(n); // 결과 출력
  //     return n; // 결과 반환
  //   };

  const typeConvert = (s: string[][]) => {
    let n = "";

    s.forEach((v, i) => {
      n += `"${v.join(" ")}"${"\n"}`;
    });

    return n;
  };

  const handleTypeValue = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    const value = target.getAttribute("value");

    if (value) {
      const typeObj = JSON.parse(value);
      const { quantity, type } = typeObj;

      setCount(quantity);
      setIsOpen(!isOpen);
      if (type) {
        let $type = typeConvert(type);
        setGalleryType($type);
      }
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <Drop>
        <div onClick={() => setIsOpen((prevState) => !prevState)}>
          {isOpen ? "off" : "on"}
        </div>
        {!isOpen && (
          <ul onClick={handleTypeValue} style={{ listStyle: "none" }}>
            <li value={JSON.stringify(imgType.a)}>1</li>
            <li value={JSON.stringify(imgType.b)}>2</li>
            <li value={JSON.stringify(imgType.c)}>3</li>
          </ul>
        )}
      </Drop>

      <div>{count}</div>
      <GridContainer galleryType={galleryType}>
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

      {/* <GalleryWrapper>
        {}
        <img
          className="items item1"
          src={`${process.env.REACT_APP_IMAGE_BASE_URL}/married.jpg`}
          alt="이미지"
        />
      </GalleryWrapper> */}
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
