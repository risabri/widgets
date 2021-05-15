import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { usePrifina } from "@prifina/hooks";

import {
  Flex,
  ChakraProvider,
  Text,
  Box,
  Image,
  Stack,
} from "@chakra-ui/react";

import BedIcon from "./assets/bed.svg";
import ClockIcon from "./assets/clock.svg";

import Clock from "./components/Clock";
import Graph from "./components/Graph";

const styles = {
  background: "linear-gradient(0deg, black 0%, #000C40 100%)",
  borderRadius: "10px",
  paddingTop: "17px",
  paddingLeft: "12px",
};

const Alarm = () => {
  return (
    <ChakraProvider>
      <Flex w="320px" h="320px" style={styles} flexDirection="column">
        <Flex alt="upperBox" flexDirection="row">
          <Box flex={2}>
            <Text color="#FF2574" fontSize={12} paddingBottom="12px">
              Smart Alarm
            </Text>
            <Image src={BedIcon} paddingBottom="5px" />
            <Text fontSize={10} paddingBottom="15px" color="white">
              Recommended schedule based on your sleep history:
            </Text>
            <Stack padding>
              <Text fontSize={10} lineHeight={1} color="white" as="b">
                11:00 PM bedtime
              </Text>
              <Text fontSize={10} lineHeight={1} color="white" as="b">
                6:30 AM wake time
              </Text>
            </Stack>
          </Box>
          <Clock />
        </Flex>
        <Flex alt="downBox" flexDirection="row" justifyContent="space-between">
          <Box>
            <Flex paddingBottom="5px">
              <Image src={ClockIcon} paddingRight={1} />
              <Text fontSize={10} color="grey">
                Bedtime History
              </Text>
            </Flex>
            <Graph />
          </Box>
          <Box></Box>
        </Flex>
      </Flex>
    </ChakraProvider>
  );
};

export default Alarm;
