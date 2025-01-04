import axios from "axios";
import { useEffect } from "react";
import styled from "styled-components";

const Register = () => {
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8080/auth/token");
        const token = res.data.accessToken;
        setAccessTokenToStorage(token);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);

  const setAccessTokenToStorage = (token: string): void => {
    console.log(token);
  };

  return (
    <div>
      <button style={{ padding: "1rem" }}>plus</button>
      <Drop>등록</Drop>
    </div>
  );
};

export default Register;

const Drop = styled.div`
  border: 1px solid black;
  & > ul > li {
    border-bottom: 1px solid black;
    cursor: pointer;
    &:hover {
      background-color: gray;
    }
  }
`;
