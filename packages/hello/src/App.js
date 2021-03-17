import React from "react";
import { PrifinaProvider, PrifinaContext } from "@prifina/hooks";
import Hello from "./Hello";

export const App = (props) => {
  console.log('"PROVIDER ', PrifinaProvider);
  return (
    <PrifinaProvider stage={"dev"} Context={PrifinaContext}>
      <Hello {...props} />
    </PrifinaProvider>
  );
};
