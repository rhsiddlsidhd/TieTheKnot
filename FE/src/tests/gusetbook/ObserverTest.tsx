import React, { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import styled from "styled-components";

const ObserverTest = () => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Container>
      <Wraaper>
        {Array.from({ length: 6 }, (_, i) => {
          return <ObservedItem key={i}></ObservedItem>;
        })}
        {/* <LastEl ref={ref}>로딩중</LastEl> */}
      </Wraaper>
    </Container>
  );
};

const ObservedItem = () => {
  const { ref, inView, entry } = useInView({
    threshold: 1,
  });
  const [prevInView, setPrevInView] = useState(false);

  useEffect(() => {
    if (inView !== prevInView) {
      console.log("현재 inView 상태: ", inView);

      setPrevInView(inView);
    }
  }, [inView, prevInView]);

  return <Item ref={ref} $inView={inView}></Item>;
};

export default ObserverTest;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Wraaper = styled.div`
  width: 50%;
  height: 50vh;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: scroll;
  transition: overflow 3s;
  &::-webkit-scrollbar {
    width: 0;
  }
`;

const Item = styled.div<{ $inView: boolean }>`
  width: 50px;
  height: 100px;
  margin-bottom: 3rem;
  background-color: ${(props) => (props.$inView ? "green" : "black")};
  transform: ${(props) =>
    props.$inView ? "translateY(0px)" : "translateY(20px)"};
  opacity: ${(props) => (props.$inView ? 1 : 0)};
  transition: all 1s;
  flex-shrink: 0;
`;

const LastEl = styled.div`
  width: 50px;
  height: 1px;
  background-color: blue;
`;
