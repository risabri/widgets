import React, { useState, useEffect } from "react";

import { usePrifina } from "@prifina/hooks";

import OuraData from "demo-prifina/oura";

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
  ReferenceLine,
} from "recharts";

import { ArrowRight } from "./assets/icons";
import { ArrowLeft } from "./assets/icons";

import { tips } from "./data";

const staticData = [
  {
    optimalDeepSleep: 2,
  },
  {
    optimalDeepSleep: 2,
  },
  {
    optimalDeepSleep: 2,
  },
  {
    optimalDeepSleep: 2,
  },
  {
    optimalDeepSleep: 2,
  },
  {
    optimalDeepSleep: 2,
  },
  {
    optimalDeepSleep: 2,
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

const appID = "sleepwellWidget";

const Sleepwell = (props) => {
  const { onUpdate, Prifina, API, registerHooks } = usePrifina();

  const prifina = new Prifina({ appId: appID });
  const [merged, setMerged] = useState();

  const [ouraDaily, setOuraDaily] = useState();
  const [netflixData, setNetflixData] = useState();

  ///process netflix data from 30 days to 7 days
  const processNetflixData = (data) => {
    const netflixWeekData = data.map((item) => item.netflixHours);

    var filteredData = netflixWeekData.map((item) => ({
      netflixHours: item,
    }));

    var filteredItems = filteredData.slice(13, 20);

    setNetflixData(filteredItems);
  };

  const dataUpdate = async (data) => {
    // should check the data payload... :)
    console.log("TIMELINE UPDATE ", data);
    //console.log("TIMELINE UPDATE ", data.hasOwnProperty("settings"));
    //console.log("TIMELINE UPDATE ", typeof data.settings);
    //console.log("TIMELINE ", data.settings);

    const result = await API[appID].OuraData.queryOuraDaily();
    console.log("DATA NETFLIX", result.data.getS3Object.content);
  };

  useEffect(async () => {
    // init callback function for background updates/notifications
    onUpdate(appID, dataUpdate);

    // register datasource modules
    registerHooks(appID, [OuraData]);

    // get
    // console.log("SLEEP QUALITY PROPS", data);

    const result = await API[appID].OuraData.queryOuraDaily({});
    console.log("DATA ", result.data.getS3Object.content);
    if (result.data.getS3Object.content.length > 0) {
      setOuraDaily(result.data.getS3Object.content);
    }
    const result2 = await API[appID].OuraData.queryNetflixData({});
    console.log("DATA ", result2.data.getS3Object.content);
    if (result2.data.getS3Object.content.length > 0) {
      processNetflixData(result2.data.getS3Object.content);
      // setNetflixData(result2.data.getS3Object.content);
    }
  }, []);

  console.log("OURA DAILY", ouraDaily);
  console.log("NETLFIX", netflixData);

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

  const dataKey = [
    {
      value: 2,
    },
  ];

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
            data={ouraDaily}
            margin={{
              top: 6,
              right: 0,
              bottom: 0,
              left: -30,
            }}
          >
            <CartesianGrid strokeDasharray="1 1 " />
            <XAxis
              dataKey="day"
              stroke="#333570"
              fontSize={10}
              ticks={["09:00", "10:00", "11:00"]}
            />
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
              content={ouraDaily}
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
              // data={ouraDaily}
              type="monotoneX"
              name="Deep Sleep"
              dataKey="deepSleepTime"
              fill="#EEF4FF"
              stroke="#333570"
            />
            <Area
              data={netflixData}
              type="monotoneX"
              name="Netflix after 5pm"
              dataKey="netflixHours"
              fill="transparent"
              stroke="#FF9D9D"
              dot={false}
            />
            <Line name="Optimal Sleep" dataKey="null123" stroke="#CCBFCD" />
            <ReferenceLine
              y={2}
              dataKey="optimal Sleep"
              stroke="#333570"
              strokeOpacity="25%"
              strokeWidth={9}
            />
          </ComposedChart>
        </Flex>
        {getContent()}
      </Flex>
    </ChakraProvider>
  );
};

export default Sleepwell;
