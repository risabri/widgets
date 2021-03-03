import React from "react";
import styled from "styled-components";

const Container = styled.div`
  height: 200px;
  font-size: 16px;
  line-height: 200px;
  text-align: center;
  width: 200px;
`;

const Hello = ({ msg = "Hello" }) => {
  console.log("HELLO PROPS ", msg);
  return <Container>{msg}</Container>;
};

export default Hello;
