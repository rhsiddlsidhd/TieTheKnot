import React from "react";
import { NaviWrapper } from "./NaviSections";
import { SectionWrapper } from "./SubwaySections";

const BusSections = () => {
  return (
    <SectionWrapper>
      <NaviWrapper>
        <h4>버스</h4>
        <p>버스 정보가 없습니다.</p>
      </NaviWrapper>
    </SectionWrapper>
  );
};

export default BusSections;
