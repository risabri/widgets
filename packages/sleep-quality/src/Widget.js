import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { usePrifina } from "@prifina/hooks";

import { Flex, ChakraProvider, Text, Box, Image } from "@chakra-ui/react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import SheepImage from "./assets/sheep.svg";
import { fontSize, width } from "styled-system";

const data = [
  {
    name: "Su",
    deepSleep: 2,
    screenTime: 4,
  },
  {
    name: "M",
    deepSleep: 3,
    screenTime: 1,
  },
  {
    name: "T",
    deepSleep: 2,
    screenTime: 5,
  },
  {
    name: "W",
    deepSleep: 4,
    screenTime: 2,
  },
  {
    name: "Th",
    deepSleep: 3,
    screenTime: 4,
  },
  {
    name: "F",
    deepSleep: 1,
    screenTime: 5,
  },
  {
    name: "Sa",
    deepSleep: 1,
    screenTime: 3,
  },
];

const styles = {
  background:
    "linear-gradient(180deg, #231345 36.28%, #2B2362 89.8%, #32327E 105.56%)",
  borderRadius: "10px",
  paddingTop: "6px",
  paddingLeft: "19px",
};

const Widget = () => {
  const [opacity, setOpacity] = useState({
    deepSleep: 1,
    screenTime: 1,
  });
  const handleMouseEnter = (o) => {
    const { dataKey } = o;
    setOpacity({ ...opacity, [dataKey]: 0.5 });
  };
  const handleMouseLeave = (o) => {
    const { dataKey } = o;
    setOpacity({ ...opacity, [dataKey]: 1 });
  };
  return (
    <ChakraProvider>
      <Flex w="312px" height="144px" style={styles} flexDirection="column">
        <Text color="white" fontSize={12}>
          Sleep Quality
        </Text>
        <Box paddingRight="13px" paddingLeft="95px">
          <Text fontSize="10px" color="#72DDFF" textAlign="right">
            To improve your quality and quantity of sleep, try avoiding screens
            before going to bed.
          </Text>
        </Box>
        <Flex alt="graph" flexDirection="column">
          <Text fontSize={7} color="white">
            Hours
          </Text>
          <LineChart
            width={275}
            height={68}
            data={data}
            margin={{
              top: 0,
              right: 40,
              left: -40,
              bottom: 0,
            }}
          >
            <CartesianGrid
              horizontal={false}
              vertical={false}
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tick={{ fontSize: 7, fill: "white" }}
              tickLine={false}
            />
            <YAxis
              type="number"
              axisLine={false}
              tick={{ fontSize: 7, fill: "white" }}
              tickLine={false}
              domain={[0, "dataMax + 1"]}
            />

            <Legend
              verticalAlign="top"
              layout="vertical"
              align="right"
              wrapperStyle={{
                paddingLeft: 10,

                fontSize: 7,
              }}
              iconType="line"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              // payload={[
              //   {
              //     id: "deepSleep",
              //     value: "Deep Sleep",
              //     type: "line",
              //     color: "#FF7601",
              //   },
              //   {
              //     id: "screenTime",
              //     value: "Screen Time",
              //     type: "line",
              //     color: "#FFC700",
              //   },
              // ]}
            />
            <Line
              type="linear"
              dataKey="deepSleep"
              name="Deep Sleep"
              strokeOpacity={opacity.deepSleep}
              stroke="#FF7601"
              activeDot={{ r: 8 }}
              dot={false}
            />
            <Line
              type="linear"
              dataKey="screenTime"
              name="Screen Time"
              strokeOpacity={opacity.screenTime}
              stroke="#FFC700"
              dot={false}
            />
          </LineChart>
        </Flex>
        <Box position="absolute" alignSelf="flex-end" top={144 - 63}>
          <Image src={SheepImage} />
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default Widget;
