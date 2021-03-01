import React from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 10px;
  height: 200px;
  font-size: 16px;
  line-height: 200px;
  text-align: center;
  width: 200px;
`;

const Hello = () => {
  return <Container>Hello</Container>;
};

export default Hello;
