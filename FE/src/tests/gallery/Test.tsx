import React, { useEffect, useState } from "react";
import styled from "styled-components";
import typeData from "./data";

type Item = {
  quantity: number;
  type: string;
};

type SelectedType = {
  [id: string]: Item | undefined;
};

interface GalleryDropState {
  [id: string]: boolean;
}

const Tset = () => {
  const [toggleDropdown, setToggleDropdown] = useState<GalleryDropState>({});
  const [selectedType, setSelectedType] = useState<SelectedType>({});

  useEffect(() => {
    for (const id in selectedType) {
      setToggleDropdown((prev) => ({ ...prev, [id]: false }));
    }
  }, [selectedType]);

  const typeConvert = (s: string[][]) => {
    let n = "";

    s.forEach((v, i) => {
      n += `"${v.join(" ")}"${"\n"}`;
    });

    return n;
  };

  const handleGalleryType = (id: string, e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    const value = target.getAttribute("value");

    if (value) {
      try {
        const data = JSON.parse(value);
        const { quantity, type } = data;
        let convertedType = typeConvert(type);
        setSelectedType((prev) => ({
          ...prev,
          [id]: { quantity, type: convertedType },
        }));
        handleDropdown(id);
      } catch (err) {
        console.error("Error parsing value", err);
      }
    }
  };

  const handleDropdown = (id: string) => {
    setToggleDropdown((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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

  const galleryAddCount = () => {
    let galleryId = generateRandomId();
    setSelectedType((prev) => ({ ...prev, [galleryId]: undefined }));
  };

  return (
    <div style={{ padding: "1rem" }}>
      <button style={{ padding: "1rem" }} onClick={galleryAddCount}>
        plus
      </button>
      <h1>갤러리 카운트 </h1>
      {Object.keys(selectedType).map((galleryId) => {
        return (
          <Drop key={galleryId}>
            <div onClick={() => handleDropdown(galleryId)}>
              {toggleDropdown[galleryId] ? "on" : "off"}
            </div>
            {toggleDropdown[galleryId] && (
              <ul
                onClick={(e) => handleGalleryType(galleryId, e)}
                style={{ listStyle: "none" }}
              >
                {Object.keys(typeData).map((v, i) => {
                  const value = JSON.stringify(typeData[v]);
                  return (
                    <li key={i} value={value}>
                      {v}
                    </li>
                  );
                })}
              </ul>
            )}
          </Drop>
        );
      })}
      <div>갤러리 items</div>
      {Object.keys(selectedType).map((v, i) => {
        const quantity = selectedType[v]?.quantity || 0;
        const type = selectedType[v]?.type || "undefined";
        return (
          <GridContainer $galleryType={type} key={v}>
            {Array.from({ length: quantity }, (_, i) => {
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
const GridContainer = styled.div<{ $galleryType: string }>`
  display: grid;
  width: 90%;
  border: 1px solid red;
  grid-auto-rows: 8rem;
  grid-template-areas: ${({ $galleryType }) => $galleryType};
  grid-gap: 1rem;
  padding: 1rem;
  & > img {
    border: 1px solid black;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
