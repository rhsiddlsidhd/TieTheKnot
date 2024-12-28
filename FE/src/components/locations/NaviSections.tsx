import React from "react";
import { BtnWrapper } from "../../pages/Main";
import styled from "styled-components";
import openApp from "../../utils/openApp";
import { GeoProps } from "../../apis/api/location/kakaoMap/types";
import { SectionWrapper } from "./SubwaySections";

interface NaviSectionsProps {
  currentGeoState: GeoProps;
  geoState: GeoProps;
}

const NaviSections = ({ currentGeoState, geoState }: NaviSectionsProps) => {
  const iconsPath = [
    {
      name: "네이버지도",
      path: "navermap.webp",
      onClick: () => openApp.openNaverMap(currentGeoState, geoState),
    },
    {
      name: "카카오지도",
      path: "kakaomap.png",
      onClick: () => openApp.openKakaoMap(currentGeoState, geoState),
    },
    { name: "티맵", path: "tmap.svg", onClick: () => openApp.openTmap() },
  ];

  return (
    <SectionWrapper>
      <NaviWrapper>
        <h4>네비게이션</h4>
        <p>원하시는 앱을 선택하시면 길 안내가 시작됩니다.</p>
        <BtnWrapper
          style={{
            width: "100%",
          }}
        >
          {iconsPath.map((icons, i) => {
            return (
              <button onClick={icons.onClick} key={i}>
                <img
                  src={`${process.env.REACT_APP_IMAGE_BASE_URL}/${icons.path}`}
                  alt="map"
                  style={{
                    width: "1rem",
                    height: "1rem",
                    marginRight: "0.5rem",
                  }}
                />
                <span>{icons.name}</span>
              </button>
            );
          })}
        </BtnWrapper>
      </NaviWrapper>
    </SectionWrapper>
  );
};

export default NaviSections;

export const NaviWrapper = styled.div`
  width: 100%;

  & > h4 {
  }
  & > h4,
  p {
    display: flex;
  }
  & p {
    color: #999999;
  }
`;
