import React from "react";
import styled from "styled-components";

/**
 * input 으로 기본 지하철역 검색
 * ul > li
 *
 */

const Test = () => {
  return (
    <Container>
      <BasicInput />
      <StationListWrapper>
        <StationList>리스트</StationList>
      </StationListWrapper>
    </Container>
  );
};

export default Test;

const Container = styled.div`
  padding: 3rem;
`;

const BasicInput = styled.input`
  margin-bottom: 3rem;
`;

const StationListWrapper = styled.ul`
  list-style: none;
`;

const StationList = styled.li``;
