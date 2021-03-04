import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { usePrifina } from "@prifina/hooks";

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

  const { currentUser, onUpdate } = usePrifina({ appID: "HelloWidget" });
  console.log("Logged in user ", currentUser);

  const msgText = msg || "Hello, " + currentUser.name;
  const [helloText, setHelloText] = useState(msgText);

  onUpdate((data) => {
    console.log("HELLO HERE ", data);
  });

  useEffect(() => {
    console.log("UPDATE DATA ", data);
    if (data.msg) {
      setHelloText(data.msg);
    }
  }, [data]);

  return <Container>{helloText}</Container>;
};
Hello.displayName = "Hello";

export default Hello;
