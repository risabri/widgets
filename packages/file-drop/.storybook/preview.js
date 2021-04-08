import React from "react";
import { addDecorator, addParameters } from "@storybook/react";

import { PrifinaProvider, PrifinaContext } from "@prifina/hooks";
const themeProviderDecorator = (story) => (
  <PrifinaProvider stage={"dev"} Context={PrifinaContext}>
    {story()}
  </PrifinaProvider>
);

addDecorator(themeProviderDecorator);
