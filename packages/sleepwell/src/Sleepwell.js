import React, { useState, useEffect } from "react";

import { usePrifina } from "@prifina/hooks";

import {
  Flex,
  ChakraProvider,
  Text,
  IconButton,
  ButtonGroup,
} from "@chakra-ui/react";

import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { ArrowRight } from "./assets/icons";
import { ArrowLeft } from "./assets/icons";

import { data, tips } from "./data";

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

const appID = "sleepwell";

const Sleepwell = (props) => {
  const { onUpdate, Prifina, API, registerHooks } = usePrifina();

  const prifina = new Prifina({ appId: appID });

  useEffect(async () => {
    // init callback function for background updates/notifications
    onUpdate(appID);
    // register datasource modules
    registerHooks(appID);
    // get
  }, []);

  const [step, setStep] = useState(0);

  console.table(tips);

  let title = 0;
  let text = 0;

  switch (step) {
    case 0:
      title = tips[0].title;
      text = tips[0].text;
      break;
    case 1:
      title = tips[1].title;
      text = tips[1].text;
      break;
    case 2:
      title = tips[2].title;
      text = tips[2].text;
      break;
    case 3:
      title = tips[3].title;
      text = tips[3].text;
      break;
    case 4:
      title = tips[4].title;
      text = tips[4].text;
      break;
    default:
      title = tips[0].title;
      text = tips[0].text;
  }

  const getContent = () => {
    return (
      <Flex
        alt="bottomContainer"
        flexDirection="column"
        bg="#1C1F6D"
        height="100%"
        borderBottomLeftRadius="10px"
        borderBottomRightRadius="10px"
        justifyContent="center"
        alignItems="center"
        textAlign="left"
      >
        <Flex flexDirection="column" paddingLeft="30px" paddingRight="30px">
          <Text fontSize="12px" color="#FF9D9D" fontWeight="700">
            {title}
          </Text>
          <Text fontSize="10px" color="#FCEBEB">
            {text}
          </Text>
        </Flex>
        <ButtonGroup spacing={0} alignSelf="flex-end" paddingRight="11px">
          <IconButton
            aria-label="Search database"
            icon={<ArrowLeft />}
            onClick={() => setStep(step - 1, tips.length)}
          />
          <IconButton
            aria-label="Search database"
            icon={<ArrowRight />}
            onClick={() => setStep(step + 1, tips.length)}
          />
        </ButtonGroup>
      </Flex>
    );
  };
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
            <Tooltip
              wrapperStyle={{
                width: "auto",
                height: 30,
                background: "transparent",
              }}
              labelStyle={{
                fontSize: 10,
              }}
              contentStyle={{
                fontSize: 10,
              }}
            />
            <Legend
              layout="horizontal"
              iconType="circle"
              iconSize="5px"
              wrapperStyle={legendStyle}
            />
            <Area
              type="monotoneX"
              name="Deep Sleep"
              dataKey="deepSleep"
              fill="#EEF4FF"
              stroke="#333570"
            />
            <Area
              type="monotoneX"
              name="Netflix after 5pm"
              dataKey="netflixHours"
              fill="transparent"
              stroke="#FF9D9D"
              dot={false}
            />
            <Line
              type="monotone"
              name="Optimal Sleep"
              dataKey="optimalDeepSleep"
              stroke="#333570"
              strokeOpacity="25%"
              strokeWidth={9}
              dot={false}
            />
          </ComposedChart>
        </Flex>
        {getContent()}
      </Flex>
    </ChakraProvider>
  );
};

export default Sleepwell;
