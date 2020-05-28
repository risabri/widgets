import React from "react";
import { ObjectTest, ComponentTest } from "../src";
export default { title: "Index" };

export const indexTest = () => <div>{JSON.stringify(ObjectTest)}</div>;

indexTest.story = {
  name: "Object",
};

export const indexTest2 = () => <ComponentTest />;

indexTest2.story = {
  name: "Component",
};
