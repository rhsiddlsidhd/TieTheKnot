import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Test = () => {
  const googleLogin = () => {
    const clientId = `362838615937-hjspjrai3sovuqu9pbqpsju3onpjgb0t.apps.googleusercontent.com`;
    const redirectUri = `http://localhost:3000/test`;
    const responseType = "token";
    const scope = `https://www.googleapis.com/auth/userinfo.email`;

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=${scope}&response_type=${responseType}&redirect_uri=${redirectUri}&client_id=${clientId}&include_granted_scopes=true`;

    window.location.href = authUrl;
  };

  return (
    <Container>
      <p>Google 로그인</p>
      <div>
        <button onClick={googleLogin}>로그인 버튼</button>
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
