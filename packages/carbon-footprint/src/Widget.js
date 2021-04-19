import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { usePrifina } from "@prifina/hooks";

import { Flex, ChakraProvider, Text, Box, Image } from "@chakra-ui/react";

const styles = {
  background: "linear-gradient(169.38deg, #D0FFC5 5.05%, #99E4A5 90.75%)",
  borderRadius: "10px",
};
const title = {
  fontSize: 10,
  fontWeight: 600,
};
const text = {
  fontSize: 10,
};

import CarIcon from "./assets/car.svg";
import CarbonIcon from "./assets/carbon.svg";
import OffsetIcon from "./assets/offset.svg";
import DonationIcon from "./assets/donation.svg";
import QuestionmarkIcon from "./assets/questionmark.svg";

const appID = "carbonFootprintWidget";

const Widget = () => {
  const { onUpdate, Prifina, API, registerHooks } = usePrifina();

  const prifina = new Prifina({ appId: appID });

  return (
    <ChakraProvider>
      <Flex w="332px" h="144px" style={styles} justifyContent="space-between">
        <Box alt="leftBox" paddingRight="12px" flex={2} paddingLeft="10px">
          <Box paddingBottom="5px">
            <Text fontSize={12} color="#2B7063">
              Carbon Footprint
            </Text>
          </Box>
          <Flex>
            <Image src={CarIcon} paddingRight="7px" />
            <Box>
              <Text style={title}>You drove</Text>

              <Text style={text}>347 miles last month.</Text>
            </Box>
          </Flex>

          <Flex>
            <Image src={CarbonIcon} paddingRight="7px" />
            <Box>
              <Text style={title}>Your Carbon Footprint was</Text>
              <Text style={text}>0.14 metric tons of CO2.</Text>
            </Box>
          </Flex>
          <Flex>
            <Image src={OffsetIcon} paddingRight="7px" />
            <Box>
              <Text style={title}>To offset this</Text>
              <Text style={text}>you could plant 9 trees.</Text>
            </Box>
          </Flex>
        </Box>
        <Box alt="rightBox" flex={2} paddingTop="14px" paddingRight="7px">
          <Flex>
            <Image src={DonationIcon} paddingRight="7px" />
            <Box>
              <Text style={title}>Consider donating</Text>
              <Text style={text} lineHeight={1}>
                $2.84 to the Global Portfolio, a certified carbon reduction
                program, to offset last month’s footprint.
              </Text>
            </Box>
          </Flex>
          <Flex>
            <Image src={QuestionmarkIcon} paddingRight="5px" />
            <Box>
              <Text style={title}>Did you know?</Text>
              <Text style={text} lineHeight={1}>
                Automobile fuel economy can improve 7-14% by simply observing
                the speed limit.
              </Text>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default Widget;
