import React from "react";
import styled from "styled-components";

const Container = styled.div`
  height: 200px;
  font-size: 16px;
  line-height: 200px;
  text-align: center;
  width: 200px;
`;

const Hello = (props) => {
  console.log("HELLO PROPS ", props);
  const msg = props.msg || "Hello";
  return <Container>{msg}</Container>;
};

export default Hello;
