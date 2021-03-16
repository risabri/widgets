import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { usePrifina } from "@prifina/hooks";

const Container = styled.div`
  height: 200px;
  font-size: 16px;
  width: 200px;

  display: flex;
  justify-content: center;
  align-items: center;
`;
const appID = "helloWidget";
const Hello = ({ Context, ...props }) => {
  console.log("HELLO PROPS", props);
  const { msg, data } = props;

  //const { currentUser, onUpdate, check } = usePrifina({ appID: "HelloWidget" });
  const { onUpdate, Prifina } = usePrifina();
  const prifina = new Prifina({ appiD: appID });
  console.log("HELLO HOOK ", prifina);
  //console.log("Logged in user ", currentUser);
  const msgText = msg || "Hello, ";
  //const msgText = msg || "Hello, " + currentUser.name;
  const [helloText, setHelloText] = useState(msgText);
  const [helloData, setData] = useState(data);

  const currentUser = typeof data.currentUser ? data.currentUser.name : "";
  const dataUpdate = (data) => {
    console.log("HELLO UPDATE ", data);

    setHelloText(data.msg);
  };
  useEffect(() => {
    console.log("HELLO UPDATE INIT ");
    onUpdate(appID, dataUpdate);
  }, []);

  useEffect(() => {
    console.log("UPDATE HELLO DATA ", helloData);
    if (typeof helloData.settings !== "undefined") {
      if (helloData.settings.msg) {
        setHelloText(helloData.settings.msg);
      }
    }
  }, [helloData]);

  return (
    <Container>
      <div>
        <div>{helloText}</div>
        <div>{currentUser}</div>
      </div>
    </Container>
  );
};
Hello.displayName = "Hello";

export default Hello;
