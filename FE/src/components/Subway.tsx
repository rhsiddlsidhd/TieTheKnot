import { NaviWrapper } from "./Location";
import styled from "styled-components";

import subwayInstance from "./../axios/interceptorsSubway/interceptorsSubway";

const Subway = () => {
  const fetchSubwayStation = async () => {
    try {
      const startIndex = 1;
      const endIndex = 10;
      const inputSubway = " 서울역";

      const res = await subwayInstance.get(
        `/${startIndex}/${endIndex}/ /${inputSubway}`
      );
      if (res.status !== 200) {
        throw new Error(`fail >> ${res.status}`);
      }

      const data = res.data.SearchSTNBySubwayLineInfo.row;
      console.log(data);
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error("fetchSubway server Error >>", e.message);
      }
    }
  };

  //   useEffect(() => {
  //     fetchSubwayStation();
  //   }, []);

  return (
    <SubwayContainer>
      <NaviWrapper>
        <h4>지하철</h4>
        <p>아아나낭</p>
        <button onClick={fetchSubwayStation}>버튼</button>
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
