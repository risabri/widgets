import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { usePrifina, useHooks } from "@prifina/hooks";

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

  //const { currentUser, onUpdate, check } = usePrifina({ appID: "HelloWidget" });
  const prifina = useHooks();
  //console.log("Logged in user ", currentUser);
  const msgText = msg || "Hello, ";
  //const msgText = msg || "Hello, " + currentUser.name;
  const [helloText, setHelloText] = useState(msgText);

  onUpdate((data) => {
    console.log("HELLO HERE ", data);
  });

  //console.log(onUpdate, typeof onUpdate);
  //console.log(check());
  useEffect(() => {
    console.log("UPDATE DATA ", data);
    if (typeof data !== "undefined") {
      if (data.msg) {
        setHelloText(data.msg);
      }
    }
  }, [data]);

  return <Container>{helloText}</Container>;
};
Hello.displayName = "Hello";

export default Hello;
