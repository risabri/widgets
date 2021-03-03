import React from "react";
import App from "../src/Hello";

export default { title: "Test" };

export const app = () => <App msg={"Hello, Tero"} />;
app.story = {
  name: "App",
};
