import { useNavigate } from "react-router";
import styled from "styled-components";
import UseAuthFailRedirect from "../hooks/UseAuthFailRedirect";

const Register = () => {
  const isAuth = UseAuthFailRedirect();
  const navigate = useNavigate();
  const navigateOrderPage = () => {
    navigate("/order");
  };

  return (
    <Container>
      <div>{isAuth && <div>LOGINSUCCESS</div>}</div>
      <PageWrapper>
        <div onClick={navigateOrderPage}>주문하기</div>
        <div>내 주문보기</div>
      </PageWrapper>
    </Container>
  );
};

export default Register;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  & > div:first-child {
    height: 10vh;
    display: flex;
    align-items: center;
  }
`;

const PageWrapper = styled.div`
  height: 90vh;
  display: flex;
  align-items: center;
  /* justify-content: space-between; */
  & > div {
    border: 1px solid black;
    padding: 5rem;
  }
`;
