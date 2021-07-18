import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { usePrifina } from "@prifina/hooks";

import {
  Flex,
  ChakraProvider,
  Text,
  Box,
  Image,
  Button,
  IconButton,
  Icon,
  ButtonGroup,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";

import { SleepingEmoji } from "./assets/icons";
import { FireIcon } from "./assets/icons";
import { WalkIcon } from "./assets/icons";
import { HealthIcon } from "./assets/icons";
import { EditIcon } from "./assets/icons";

const containerStyle = {
  width: "308px",
  height: "296px",
  background: "#29043B",
  borderRadius: "10px",
  boxShadow: "0px 2px 8px rgba(91, 92, 91, 0.2)",
  padding: 7,
  flexDirection: "column",
};

const circularProgressStyle = {
  position: "absolute",
  borderRadius: 10,
  thickness: 10,
  // y: -1,
  transform: "rotate(180deg)",
  // transform: "scaleX(-1)",
  // transform: ["scaleX(-1)", "rotate(45deg)"],
};

const CustomButton = ({ icon, text }) => {
  return (
    <Box
      as="button"
      height="32px"
      width="132px"
      lineHeight="1.2"
      transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
      px="8px"
      borderRadius="5px"
      fontSize="10px"
      fontWeight="bold"
      bg="transparent"
      color="#4b4f56"
      _hover={{ bg: "#39114F" }}
      _active={{
        bg: "#39114F",
        transform: "scale(0.98)",
      }}
      _focus={{
        boxShadow:
          "0 0 1px 2px rgba(88, 144, 255, .75), 0 1px 1px rgba(0, 0, 0, .15)",
        bg: "#39114F",
      }}
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
      alignItems="center"
    >
      {icon}
      <Text paddingLeft="9px">{text}</Text>
    </Box>
  );
};

const Card = ({ icon, title, subtitle, unit }) => {
  return (
    <Flex
      height="63.5px"
      width="93px"
      padding="6px"
      borderRadius="5px"
      bg="#39114F"
      flexDirection="column"
      alignItems="space-between"
    >
      {icon}
      <Flex alignItems="baseline">
        <Text fontSize="16px" fontWeight="700" color="#F6F6F6">
          {title}
        </Text>
        <Text
          fontSize="10px"
          fontWeight="400"
          color="#F6F6F6"
          paddingLeft="3px"
        >
          {unit}
        </Text>
      </Flex>

      <Text fontSize="10px" fontWeight="700" color="#ADADAD">
        {subtitle}
      </Text>
    </Flex>
  );
};

const appID = "holisticHealthWidget";

const HolisticHealth = () => {
  const { onUpdate, Prifina, API, registerHooks } = usePrifina();

  const prifina = new Prifina({ appId: appID });

  return (
    <ChakraProvider>
      <Flex alt="container" style={containerStyle} flex={1}>
        <Text fontSize="16px" color="#3271E6" fontWeight="bold">
          Holistic Health
        </Text>
        <Flex alt="uppperContaner">
          <Flex alt="leftSide" flexDirection="column" flex={2}>
            <Flex justifyContent="space-between" alignItems="center">
              <Text fontSize="12px" color="#F6F6F6" fontWeight="bold">
                Daily Goals
              </Text>
              <IconButton icon={<EditIcon />} />
            </Flex>
            <ButtonGroup spacing={0} flexDirection="column">
              <CustomButton icon={<SleepingEmoji />} text="6/8 hrs" />
              <CustomButton icon={<FireIcon />} text="1456 /2000 kcal" />
              <CustomButton icon={<WalkIcon />} text="9.5k /10k Steps" />
            </ButtonGroup>
          </Flex>
          <Flex
            alt="rightSide"
            alignItems="center"
            justifyContent="center"
            flex={2}
          >
            <CircularProgress
              style={circularProgressStyle}
              value={60}
              size="113px"
              trackColor="transparent"
              color="#DC3284"
              thickness="12px"
            />
            <CircularProgress
              style={circularProgressStyle}
              value={70}
              size="88px"
              trackColor="transparent"
              color="#E7D535"
              thickness="12px"
            />
            <CircularProgress
              style={circularProgressStyle}
              value={80}
              size="66px"
              trackColor="transparent"
              color="#AE35E7"
              thickness="12px"
            />
            <HealthIcon />
          </Flex>
        </Flex>
        <Flex alt="bottomContainer" paddingTop="20px" flexDirection="column">
          <Text color="white" fontSize="12px" fontWeight="700">
            7 day averages
          </Text>
          <Flex paddingTop="16px" justifyContent="space-between">
            <Card
              icon={<SleepingEmoji size="15px" />}
              title="7.5"
              subtitle="Sleep per night"
            />
            <Card
              icon={<FireIcon size="15px" />}
              title="7.5"
              subtitle="Burnt per day"
            />
            <Card
              icon={<WalkIcon size="15px" />}
              title="7.5"
              subtitle="Walked per day"
            />
          </Flex>
        </Flex>
      </Flex>
    </ChakraProvider>
  );
};

export default HolisticHealth;
