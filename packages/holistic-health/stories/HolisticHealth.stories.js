import React from "react";
import HolisticHealth from "../src/HolisticHealth";

export default { title: "Holistic Health Widget" };

export const box = () => <HolisticHealth stage={"dev"} />;
box.story = {
  name: "Holistic Health Widget",
};
