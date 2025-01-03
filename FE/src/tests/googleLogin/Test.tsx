import styled from "styled-components";

const Test = () => {
  const googleLogin = () => {
    const scope = `https://www.googleapis.com/auth/userinfo.email`;
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=${scope}&response_type=token&redirect_uri=${process.env.REACT_APP_GOOGLE_REDIRECT_URI}&client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&include_granted_scopes=true`;

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
