import React, { useState, useEffect, useRef } from "react";

import styled from "styled-components";

import { usePrifina, Op, _fn, buildFilter } from "@prifina/hooks";

// import GoogleTimeline from "@prifina/google-timeline/";
import SleepQuality from "prifina-package/sleep-quality";
import activityMockup from "prifina-package/sleep-quality/src/activityMockup";

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

const appID = "sleepQuality";

const Widget = (props) => {
  const { data } = props;

  // init hook and get provider api services...
  const { onUpdate, Prifina, API, registerHooks } = usePrifina();

  // init provider api with your appID
  const prifina = new Prifina({ appId: appID });
  const [newData, setNewData] = useState({});
  const period = useRef("");
  // setNewData(data);

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

  const dataUpdate = async (data) => {
    // should check the data payload... :)
    console.log("TIMELINE UPDATE ", data);
    //console.log("TIMELINE UPDATE ", data.hasOwnProperty("settings"));
    //console.log("TIMELINE UPDATE ", typeof data.settings);

    if (
      data.hasOwnProperty("settings") &&
      typeof data.settings === "object" &&
      data.settings.year !== ""
    ) {
      //console.log("TIMELINE ", data.settings);

      const year = parseInt(data.settings.year);
      const month = parseInt(data.settings.month);
      period.current = year + "/" + month;
      const filter = {
        [Op.and]: {
          [year]: {
            [Op.eq]: _fn("YEAR", "deepSleep"),
          },
          [month]: {
            [Op.eq]: _fn("MONTH", "screenTime"),
          },
          100: { [Op.eq]: _fn("CAST", "p_confidence", "int") },
        },
      };

      const result = await API[appID].SleepQuality.queryActivities({
        filter: buildFilter(filter),
      });
      console.log("DATA ", result.data.getS3Object.content);
      if (result.data.getS3Object.content.length > 0) {
        processData(result.data.getS3Object.content);
      }
    }
  };

  useEffect(async () => {
    // init callback function for background updates/notifications
    onUpdate(appID, dataUpdate);
    // register datasource modules
    registerHooks(appID, [SleepQuality]);
    // get
    console.log("TIMELINE PROPS DATA ", data);

    const d = new Date();
    const currentMonth = d.getMonth();
    d.setMonth(d.getMonth() - 1);
    while (d.getMonth() === currentMonth) {
      d.setDate(d.getDate() - 1);
    }
    let year = d.getFullYear();
    let month = d.getMonth();

    if (
      data.hasOwnProperty("settings") &&
      data.settings.hasOwnProperty("year") &&
      data.settings.year !== ""
    ) {
      year = parseInt(data.settings.year);
      month = parseInt(data.settings.month);
    }
    const filter = {
      [Op.and]: {
        [year]: {
          [Op.eq]: _fn("YEAR", "p_datetime"),
        },
        [month]: {
          [Op.eq]: _fn("MONTH", "p_datetime"),
        },
        100: { [Op.eq]: _fn("CAST", "p_confidence", "int") },
      },
    };

    period.current = year + "/" + month;
    console.log("FILTER ", filter);

    const result = await API[appID].SleepQuality.queryActivities({
      filter: buildFilter(filter),
    });
    console.log("hamza");

    console.log("DATA ", result.data.getS3Object.content);
    if (result.data.getS3Object.content.length > 0) {
      processData(result.data.getS3Object.content);
    }
  }, []);

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
            data={activityMockup}
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
