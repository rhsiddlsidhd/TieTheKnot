import React from "react";
import styled from "styled-components";

interface TextProps {
  message: string;
}

const Text = ({ message }: TextProps) => {
  return <Message>{message}</Message>;
};

export default Text;

const Message = styled.p`
  white-space: pre-line;
  word-break: keep-all;
`;
