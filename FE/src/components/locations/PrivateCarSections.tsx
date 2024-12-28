import React from "react";
import { SectionWrapper } from "./SubwaySections";
import { NaviWrapper } from "./NaviSections";
import styled from "styled-components";

const PrivateCarSections = () => {
  return (
    <SectionWrapper>
      <NaviWrapper>
        <h4>자가용</h4>
        <TextWrapper>
          <p>네비게이션: "다산 순환로20" 또는 파로스 컨벤션 입력</p>
          <p>[건물명] 다산현대프리미어 캠퍼스몰 E동</p>
        </TextWrapper>
      </NaviWrapper>
      <NaviWrapper>
        <h4>주차장 안내</h4>
        <TextWrapper>
          <p>GATE2 이용 (B3~B4)</p>
          <p>주차장이 혼잡할 수 있사오니 대중교통을 이용해주시기 바랍니다.</p>
        </TextWrapper>
      </NaviWrapper>
    </SectionWrapper>
  );
};

export default PrivateCarSections;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`;
