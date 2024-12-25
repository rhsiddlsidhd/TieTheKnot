import { NaviWrapper } from "./Location";
import styled from "styled-components";

const Subway = () => {
  return (
    <SubwayContainer>
      <NaviWrapper>
        <h4>지하철</h4>
        <p>아아나낭</p>
        <button>버튼</button>
      </NaviWrapper>
    </SubwayContainer>
  );
};

export default Subway;

const SubwayContainer = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid #eeeeee;
  padding-bottom: 1rem;
`;
