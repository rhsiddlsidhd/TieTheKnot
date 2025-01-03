import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import styled from "styled-components";

const Test = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const state = query.get("state");
  const code = query.get("code");

  const googleLoginLocation = async () => {
    window.location.href = "http://localhost:8080/auth";
  };

  return (
    <Container>
      <p>Google 로그인</p>
      <div>
        <button onClick={googleLoginLocation}>구글버튼</button>
      </div>
    </Container>
  );
};

export default Test;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;
