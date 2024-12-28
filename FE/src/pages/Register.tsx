import React, { MouseEventHandler, useContext } from "react";
import { TypeOfSelected } from "../App";
import styled from "styled-components";
import { Navigate, useNavigate } from "react-router";

const Register = () => {
  return (
    <>
      <button style={{ padding: "1rem" }}>plus</button>
      <Drop>등록</Drop>
    </>
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
