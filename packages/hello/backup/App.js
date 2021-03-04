import React from "react";
import { PrifinaProvider } from "@prifina/hooks";
import Hello from "./Hello";

export const App = (props) => (
  <PrifinaProvider>
    <Hello {...props} />
  </PrifinaProvider>
);
