import axios from "axios";
import { useEffect } from "react";
import styled from "styled-components";
import { Navigate, useNavigate } from "react-router";
import axios from "axios";

const Register = () => {
  const handleGoogleAuth = async () => {
    window.location.href = "http://localhost:8080/auth";
  };

  const handleLogin = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/auth/authenticate`, {
        withCredentials: true,
      });

      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <button onClick={handleGoogleAuth} style={{ padding: "1rem" }}>
        google
      </button>
      <button onClick={handleLogin}>login</button>
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
