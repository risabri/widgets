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

const Hello = ({ Context, ...props }) => {
  console.log("HELLO PROPS 7", props);
  const { msg, data } = props;

  //const { currentUser, onUpdate, check } = usePrifina({ appID: "HelloWidget" });
  const prifina = useHooks({ appID: "helloWidget" });
  console.log("HELLO HOOK ", prifina);
  //console.log("Logged in user ", currentUser);
  const msgText = msg || "Hello, ";
  //const msgText = msg || "Hello, " + currentUser.name;
  const [helloText, setHelloText] = useState(msgText);
  const [helloText2, setHelloText2] = useState("");
  const [helloData, setData] = useState(data);
  useEffect(() => {
    prifina.onUpdate((data) => {
      console.log("HELLO HERE ", data);
      //setData(data);
      setHelloText2(data.msg);
    });
  }, []);

  //console.log(onUpdate, typeof onUpdate);
  //console.log(check());
  useEffect(() => {
    console.log("UPDATE DATA ", helloData);
    if (typeof helloData !== "undefined") {
      if (helloData.msg) {
        setHelloText(helloData.msg);
      }
    }
  }, [helloData]);

  return (
    <Container>
      {helloText}
      {helloText2}
    </Container>
  );
};
Hello.displayName = "Hello";

export default Hello;
