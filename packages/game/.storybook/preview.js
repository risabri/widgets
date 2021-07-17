import React from "react";
import { addDecorator, addParameters } from "@storybook/react";

import { PrifinaProvider, PrifinaContext } from "@prifina/hooks";

/*
stage={"alpha"}
Context={PrifinaContext}
activeUser={activeUser.current}
activeApp={coreApp}
remoteUser={remoteUser}
remoteClient={remoteClient}
*/
const activeUser = {
  name: "test-name",
  uuid: "test-uuid",
};
const remoteUser = () => {
  return Promise.resolve(true);
};
const remoteClient = () => {
  return {};
};

const themeProviderDecorator = (story) => (
  <PrifinaProvider
    stage={"dev"}
    Context={PrifinaContext}
    activeUser={activeUser}
    remoteUser={remoteUser}
    remoteClient={remoteClient}
  >
    {story()}
  </PrifinaProvider>
);

addDecorator(themeProviderDecorator);
