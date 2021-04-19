import React from "react";
import { PrifinaProvider, PrifinaContext } from "@prifina/hooks";
// import Hello from "./Hello";
import { Container } from "./Container";

// this is only for local webpack server test  => yarn start
export const LocalComponent = (props) => {
  return (
    <PrifinaProvider stage={"dev"} Context={PrifinaContext}>
      <Container {...props} />
    </PrifinaProvider>
  );
};
