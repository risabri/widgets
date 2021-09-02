import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { usePrifina } from "@prifina/hooks";

import OuraData from "prifina/oura";

import { Flex, ChakraProvider, Text, Input, Image } from "@chakra-ui/react";

import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  ComposedChart,
  ReferenceLine,
} from "recharts";

import useFetch from "./hooks/useFetch";
import { API_KEY, API_BASE_URL } from "./config";
import { days, months, dayLetter } from "./utils/period";
import { activityData } from "./data";

const containerStyle = {
  width: "308px",
  height: "296px",
  background:
    "linear-gradient(180deg, #0D3D4D 0%, rgba(0, 44, 69, 0.04) 100%), #071833",
  borderRadius: "10px",
  boxShadow: "0px 2px 8px rgba(91, 92, 91, 0.2)",
  padding: 8,
  flexDirection: "column",
};

const appID = "dryRunWidget";

const DryRun = (props) => {
  const { onUpdate, Prifina, API, registerHooks } = usePrifina();

  const prifina = new Prifina({ appId: appID });

  const { city, data } = props;

  let defaultCity = city;
  if (
    typeof data !== "undefined" &&
    data.hasOwnProperty("settings") &&
    typeof data.settings === "object" &&
    data.settings.hasOwnProperty("city") &&
    data.settings.city.length > 0
  ) {
    defaultCity = data.settings.city;
  }

  const [searchCity, setCity] = useState(defaultCity);

  const dataUpdate = (data) => {
    if (
      data.hasOwnProperty("settings") &&
      typeof data.settings === "object" &&
      data.settings.hasOwnProperty("city")
    ) {
      setCity(data.settings.city);
      setUrl(
        `${API_BASE_URL}/data/2.5/onecall?q=${data.settings.city}&units=metric&appid=${API_KEY}`
      );
    }
  };

  useEffect(() => {
    // init callback function for background updates/notifications
    onUpdate(appID, dataUpdate);
  }, []);

  const { weatherData, error, isLoading, setUrl } = useFetch(
    `${API_BASE_URL}/v1/forecast.json?key=${API_KEY}&q=${searchCity}&days=3&aqi=no&alerts=no`
  );

  if (error) return <h2>Error when fetching: {error}</h2>;
  if (!weatherData && isLoading) return <h2>LOADING...</h2>;
  if (!weatherData) return null;

  console.log("WEATHER DATA", weatherData);
  console.log("CITY", city);

  const weatherChart = () => {
    const threeDaysData = weatherData.forecast.forecastday;

    const icon1 = threeDaysData[0].day.condition.icon;
    const icon2 = threeDaysData[1].day.condition.icon;
    const icon3 = threeDaysData[2].day.condition.icon;

    console.log("FORECAST THREE DAYS2", threeDaysData);

    const day1 = threeDaysData[0].date;
    const day2 = threeDaysData[1].date;
    const day3 = threeDaysData[2].date;

    const newDate1 = new Date(day1);

    const newDate2 = new Date(day2);
    const newDate3 = new Date(day3);
    // const dayName2 = new Date(day2);
    // const dayName3 = new Date(day3);
    const dayDisplay = days[newDate1.getDay()];

    const dayName1 = dayLetter[newDate1.getDay()];
    const dayName2 = dayLetter[newDate2.getDay()];
    const dayName3 = dayLetter[newDate3.getDay()];
    // var dayName2 = days[day2.getDay()];
    // var dayName3 = days[day3.getDay()];

    console.log("Day222", dayName1);
    console.log("NEW DATE", newDate1);

    const date = new Date(day1);
    const dateNumber = date.getDate();
    const month = months[date.getMonth()];

    console.log("3333", dateNumber);
    console.log("4444", month);

    return (
      <Flex flexDirection="column">
        <Flex justifyContent="center">
          <Flex flexDirection="column" alignItems="center">
            <Image src={icon1} boxSize="40px" />
            <Text color="#FFF500" fontWeight="700" fontSize="12px">
              {dayName1}
            </Text>
          </Flex>
          <Flex flexDirection="column" alignItems="center">
            <Image src={icon2} boxSize="40px" />
            <Text color="#909599" fontWeight="700" fontSize="12px">
              {dayName2}
            </Text>
          </Flex>
          <Flex flexDirection="column" alignItems="center">
            <Image src={icon3} boxSize="40px" />
            <Text color="#909599" fontWeight="700" fontSize="12px">
              {dayName3}
            </Text>
          </Flex>
        </Flex>
        <Text
          fontSize="18px"
          textTransform="uppercase"
          fontWeight="bold"
          fontStyle="italic"
          color="#FFFFFF"
        >
          {dayDisplay}, {dateNumber} {month}
        </Text>
      </Flex>
    );
  };

  const graph = () => {
    const threeDaysData = weatherData.forecast.forecastday;

    const oneDayData = threeDaysData[0];

    const hourData = threeDaysData[0].hour;

    // Function for combining the data from two arrays
    let combinedData = hourData.map((item, i) =>
      Object.assign({}, item, activityData[i])
    );
    console.log("COMBINED DATA", combinedData);

    console.log("FORECAST THREE DAYS", threeDaysData);
    console.log("FORECAST ONE DAY", oneDayData);
    console.log("HOUR DATA", hourData);

    return (
      <ComposedChart
        width={293}
        height={92}
        data={combinedData}
        margin={{
          top: 10,
          right: 0,
          bottom: 0,
          left: -60,
        }}
        borderWidth={0}
      >
        <XAxis
          stroke="#90CDF4"
          ticks={[5, 11, 17, 23]}
          unit="H"
          fontSize="12px"
        />
        <YAxis tick={false} />
        <Tooltip />
        <CartesianGrid stroke="#f5f5f5" stroke="none" />
        <Bar
          dataKey="chance_of_rain"
          name="Chance of rain"
          barSize={3}
          fill="#90CDF4"
          radius={3}
        />
        <Line
          type="step"
          dataKey="activity"
          name="Activity"
          stroke="#FFF500"
          dot={false}
        />
        <ReferenceLine x={5} stroke="#808080" />
        <ReferenceLine x={11} stroke="#808080" />
        <ReferenceLine x={17} stroke="#808080" />
        <ReferenceLine x={23} stroke="#808080" />
      </ComposedChart>
    );
  };

  const threeDaysData = weatherData.forecast.forecastday[0].hour;
  console.log("SSSSS", threeDaysData);

  const newR = threeDaysData;

  const trainingHours = newR.slice(6, 20);

  console.log("Reduced hours", trainingHours);

  let optimalHourDate = trainingHours.reduce((prev, curr) =>
    prev.chance_of_rain < curr.chance_of_rain ? prev : curr
  );

  function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  let h = optimalHourDate.time;
  var d = new Date(h);
  var minutes = addZero(d.getMinutes());

  var optimalHour = d.getHours();

  return (
    <ChakraProvider>
      <Flex alt="container" style={containerStyle} flex={1}>
        <Text
          fontSize="16px"
          color="#FFFFFF"
          fontWeight="bold"
          textTransform="uppercase"
        >
          //Dry run//
        </Text>
        <Input
          h="28px"
          marginTop="12px"
          focusBorderColor="transparent"
          bg="#07263E"
          borderWidth={0}
          color="#90CDF4"
          fontSize="18px"
          textTransform="uppercase"
          fontWeight="bold"
          fontStyle="italic"
          borderRadius="2px"
          value={searchCity}
        ></Input>

        {weatherChart()}

        <Flex alt="bottomContainer" flexDirection="column">
          {graph()}
          <Flex flexDirection="row" justifyContent="space-between">
            <Flex flexDirection="column">
              <Flex alignItems="center">
                <Flex
                  w="7px"
                  h="7px"
                  background="#90CDF4"
                  borderRadius={999}
                  marginRight="4px"
                />
                <Text color="#FFFFFF" fontSize={10} textTransform="uppercase">
                  Chance of rain
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Flex
                  w="7px"
                  h="7px"
                  background="#FFF500"
                  borderRadius={999}
                  marginRight="4px"
                />
                <Text color="#FFFFFF" fontSize={10} textTransform="uppercase">
                  Activity history
                </Text>
              </Flex>
            </Flex>
            <Flex flexDirection="column" alignItems="center">
              <Text
                fontSize="18px"
                color="#FFFFFF"
                fontWeight="700"
              >{`${optimalHour}:${minutes}-${
                optimalHour + 1
              }:${minutes}`}</Text>
              <Text textTransform="uppercase" color="#FFF500" fontSize={10}>
                Optimal workout time
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </ChakraProvider>
  );
};

export default DryRun;
