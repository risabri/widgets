import React, { useState, useEffect } from "react";
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
  const { msg, data } = props;

  const msgText = msg || "Hello";
  const [helloText, setHelloText] = useState(msgText);

  useEffect(() => {
    console.log("UPDATE DATA ", data);
    if (data.msg) {
      setHelloText(data.msg);
    }
  }, [data]);

  return <Container>{helloText}</Container>;
};

export default Hello;
