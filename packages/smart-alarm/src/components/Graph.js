import React, { useEffect, useState } from "react";
import audio1 from "../alarm-sound.mp3";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Flex,
  ChakraProvider,
  Text,
  Box,
  Image,
  Button,
  Stack,
  Select,
} from "@chakra-ui/react";

const data = [
  {
    name: "Su",
    bedtimeStart: 11,
  },
  {
    name: "M",
    bedtimeStart: 9,
  },
  {
    name: "T",
    bedtimeStart: 12,
  },
  {
    name: "W",
    bedtimeStart: 8,
  },
  {
    name: "Th",
    bedtimeStart: 8.5,
  },
  {
    name: "F",
    bedtimeStart: 10.5,
  },
  {
    name: "Sa",
    bedtimeStart: 10,
  },
];

function Graph() {
  return (
    <Flex>
      <AreaChart
        width={200}
        height={120}
        data={data}
        margin={{
          top: 10,
          right: 0,
          left: -30,
          bottom: -10,
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={false}
          vertical={false}
        />
        <XAxis dataKey="name" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        {/* <Tooltip /> */}
        <defs>
          <linearGradient
            id="colorUv2"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
            spreadMethod="reflect"
          >
            <stop
              offset="0"
              stopColor="#00F2E4
"
            />
            <stop offset="1" stopColor="black" />
          </linearGradient>
        </defs>
        <Area
          type="linear"
          dataKey="bedtimeStart"
          stroke="#00F2E4"
          fill="url(#colorUv2)"
        />
      </AreaChart>
    </Flex>
  );
}

export default Graph;
