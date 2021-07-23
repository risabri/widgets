import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { usePrifina } from "@prifina/hooks";

import {
  Flex,
  ChakraProvider,
  Text,
  Box,
  IconButton,
  ButtonGroup,
  CircularProgress,
  Button,
  Input,
  Stack,
} from "@chakra-ui/react";

import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
  ResponsiveContainer,
  Label,
} from "recharts";

import { ArrowRight } from "./assets/icons";
import { ArrowLeft } from "./assets/icons";

import { data } from "./data";

const tips = [
  {
    title: "Increase light exposure during the day",
    text:
      "Natural sunlight or bright light during the day helps keep your circadian rhythm healthy. This improves daytime energy, as well as nighttime sleep quality and duration",
  },
  {
    title: "Take time to unwind",
    text:
      "Try shifting your nightly TV watching habit to an earlier time. Start by turning the TV off 15 minutes before you want to fall asleep, then increase that time to 30 minutes, 60 minutes, and longer.",
  },
];

const containerStyle = {
  width: "308px",
  height: "296px",
  background: "#FFEAEA",
  borderRadius: "10px",
  boxShadow: "0px 2px 8px rgba(91, 92, 91, 0.2)",

  flexDirection: "column",
};

const legendStyle = {
  fontSize: 9,
  left: -20,
};

const labelStyle = {
  // transform: [{ rotate: "90deg" }],
};

const CustomizedLabel = () => {
  return <Text>Hourasdsdaasddassas</Text>;
};

const appID = "sleepwell";

const Sleepwell = () => {
  const { onUpdate, Prifina, API, registerHooks } = usePrifina();

  const prifina = new Prifina({ appId: appID });

  const [step, setStep] = useState(0);

  const [displayTitle, setDisplayTitle] = useState("");
  const [displayText, setDisplayText] = useState("");

  function onChange() {
    console.log("hello!");
    waveHello();
  }

  let stepProgress = 0;

  switch (step) {
    case 0:
      stepProgress = 25;
      break;
    case 1:
      stepProgress = 50;
      break;
    case 2:
      stepProgress = 75;
      break;
    case 3:
      stepProgress = 100;
      break;
    case 3:
      stepProgress = 100;
      break;
    default:
      stepProgress = 50;
  }

  console.log("TITLE", displayTitle);
  console.log("TEXT", displayText);

  return (
    <ChakraProvider>
      <Flex alt="container" style={containerStyle} flex={1}>
        <Flex alt="topContainer" flexDirection="column" padding={8}>
          <Text
            paddingBottom="6px"
            color="#FF9D9D"
            fontSize={15}
            fontWeight="900"
          >
            Sleepwell
          </Text>
          <Text
            paddingLeft="30px"
            fontSize={12}
            color="#333570"
            fontWeight="700"
          >
            Nightime viewing vs Deep sleep
          </Text>

          <ComposedChart
            width={290}
            height={120}
            data={data}
            margin={{
              top: 6,
              right: 0,
              bottom: 0,
              left: -30,
            }}
          >
            <CartesianGrid stroke="none" />
            <XAxis dataKey="day" stroke="#333570" fontSize={10} />
            <YAxis
              stroke="#333570"
              fontSize={10}
              label={{
                value: "Hours",
                angle: -90,
                position: "bottom",
                offset: -20,
                stroke: "#FF9D9D",
                fontSize: 10,
              }}
              domain={[0, 5]}
            ></YAxis>
            <Tooltip />
            <Legend
              layout="horizontal"
              iconType="circle"
              iconSize="5px"
              // width={80}
              wrapperStyle={legendStyle}
            />
            <Area
              type="monotone"
              dataKey="deepSleep"
              fill="#EEF4FF"
              stroke="#333570"
            />
            <Line
              type="monotone"
              dataKey="netflixHours"
              stroke="#FF9D9D"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="optimalDeepSleep"
              stroke="#333570"
              strokeWidth={9}
              dot={false}
            />
          </ComposedChart>
        </Flex>
        <Flex
          alt="bottomContainer"
          flexDirection="column"
          bg="#1C1F6D"
          height="100%"
          // paddingTop="18px"
          borderBottomLeftRadius="10px"
          borderBottomRightRadius="10px"
          justifyContent="center"
          alignItems="center"
          textAlign="left"
          // paddingBottom="26px"
        >
          <Flex flexDirection="column" paddingLeft="30px" paddingRight="36px">
            <Text fontSize="12px" color="#FF9D9D" fontWeight="700">
              {tips[0].title}
            </Text>
            <Text fontSize="10px" color="#FCEBEB">
              {tips[0].text}
            </Text>
          </Flex>

          <ButtonGroup spacing={0} alignSelf="flex-end" paddingRight="11px">
            <ArrowLeft />
            <ArrowRight />
          </ButtonGroup>
        </Flex>
      </Flex>
    </ChakraProvider>
  );
};

export default Sleepwell;
