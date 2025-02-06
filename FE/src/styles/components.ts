import styled from "styled-components";

export const Container = styled.div`
  padding-top: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  > .mb-3 {
    margin-bottom: 3rem;
  }
  &:first-child {
    padding-top: 0;
  }
`;

export const ThumnailContent = styled.div`
  width: 80%;
  > div {
    display: flex;
    justify-content: center;
  }
  > div:last-child {
    flex-direction: column;
    margin-top: 1rem;
  }
`;

export const InvitationContent = styled.div`
  width: 80%;
  > p {
    padding: 1rem 0;
  }
`;
