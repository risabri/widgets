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
    "radial-gradient(112.15% 446.12% at 11.22% 45.49%, #5AB5D8 0%, rgba(38, 106, 142, 0.996779) 2.6%, rgba(23, 84, 120, 0.995859) 9.37%, rgba(16, 74, 111, 0.99543) 16.67%, rgba(8, 63, 99, 0.994923) 20.83%, rgba(2, 55, 91, 0.994593) 24.96%, rgba(2, 47, 83, 0.993761) 31.25%, rgba(2, 41, 77, 0.993147) 34.9%, rgba(3, 31, 65, 0.99199) 46.88%, rgba(3, 22, 56, 0.991057) 59.9%, rgba(3, 20, 54, 0.990833) 66.73%, #031436 100%)",
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
      <Flex
        w="312px"
        height="144px"
        style={styles}
        flexDirection="column"
      ></Flex>
    </ChakraProvider>
  );
};

export default Widget;
