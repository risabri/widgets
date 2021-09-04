import React from "react";
import { PrifinaProvider, PrifinaContext } from "@prifina/hooks";
import DryRun from "./DryRun";

// this is only for local webpack server test  => yarn start
export const LocalComponent = (props) => {
  return (
    <PrifinaProvider stage={"dev"} Context={PrifinaContext}>
      <DryRun {...props} />
    </PrifinaProvider>
  );
};
