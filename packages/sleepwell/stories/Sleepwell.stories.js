import React from "react";
import Sleepwell from "../src/Sleepwell";

import HolisticHealth from "../../holistic-health/src/HolisticHealth";

import DryRun from "../../dry-run/src/DryRun";

import FileDrop from "../../file-drop/src/Container";

import {
  Flex,
  ChakraProvider,
  Text,
  IconButton,
  ButtonGroup,
  Stack,
  SimpleGrid,
} from "@chakra-ui/react";

export default { title: "Widgets" };

export const box = () => (
  <SimpleGrid columns={3} spacing={5}>
    <HolisticHealth />
    <Sleepwell />
    <DryRun />
  </SimpleGrid>
);
box.story = {
  name: "Widgets",
};
