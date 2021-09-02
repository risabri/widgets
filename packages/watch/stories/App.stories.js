import React from "react";
import Watch from "../src/Watch";
import Widget from "../src/Widget";

export default { title: "Test" };

export const app = () => (
  <>
    <Widget
      offset1={120}
      offset2={-420}
      offset3={-240}
      offset4={9 * 60}
      tz1="Frankfurt"
      tz2="Los Angeles"
      tz3="New York"
      tz4="Tokyo"
    />
    {/* <Watch offset={120} tz={"Tokyo"} /> */}
  </>
);

app.story = {
  name: "App",
};
