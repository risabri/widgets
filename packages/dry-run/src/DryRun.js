import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { usePrifina } from "@prifina/hooks";

import useFetch from "./useFetch";

import { API_KEY, API_BASE_URL } from "./config";

import { Flex, ChakraProvider, Text, Input, Image } from "@chakra-ui/react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  Legend,
  ComposedChart,
} from "recharts";

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

const appID = "dryRun";

const HolisticHealth = (props) => {
  const { onUpdate, Prifina, API, registerHooks } = usePrifina();

  const prifina = new Prifina({ appId: appID });

  // const { city, data } = props;

  // let defaultCity = city;
  // if (
  //   typeof data !== "undefined" &&
  //   data.hasOwnProperty("settings") &&
  //   typeof data.settings === "object" &&
  //   data.settings.hasOwnProperty("city") &&
  //   data.settings.city.length > 0
  // ) {
  //   defaultCity = data.settings.city;
  // }

  // const [searchCity, setCity] = useState("New York");

  // const dataUpdate = (data) => {
  //   if (
  //     data.hasOwnProperty("settings") &&
  //     typeof data.settings === "object" &&
  //     data.settings.hasOwnProperty("city")
  //   ) {
  //     //setCity(data.settings.city);
  //     setUrl(
  //       `${API_BASE_URL}/data/2.5/onecall?q=${data.settings.city}&units=metric&appid=${API_KEY}`
  //     );
  //   }
  // };

  // useEffect(() => {
  //   // init callback function for background updates/notifications
  //   onUpdate(appID, dataUpdate);
  // }, []);

  // const { weatherData, error, isLoading, setUrl } = useFetch(
  //   `${API_BASE_URL}/data/2.5/forecast?q=${searchCity}&exclude=houry&units=metric&appid=${API_KEY}`
  // );

  const [city, setCity] = useState("London");

  function handleChange(event) {
    setCity(event.target.value);
  }

  const { weatherData, error, isLoading, setUrl } = useFetch(
    `http://api.weatherapi.com/v1/forecast.json?key=e72f4e2b049a4ca7918223846212007&q=${city}&days=3&aqi=no&alerts=no`
  );

  useEffect(() => {
    // init callback function for background updates/notifications
    // handleChange();
  }, [city]);

  //api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
  console.log("WEATHER DATA", weatherData);
  console.log("CITY", city);
  // console.log("FORECAST DATA", forecastData.weatherData);

  const WeatherChart = () => {
    if (error) return <h2>Error when fetching: {error}</h2>;
    if (!weatherData && isLoading) return <h2>LOADING...</h2>;
    if (!weatherData) return null;

    const threeDaysData = weatherData.forecast.forecastday;

    const icon1 = threeDaysData[0].day.condition.icon;
    const icon2 = threeDaysData[1].day.condition.icon;
    const icon3 = threeDaysData[2].day.condition.icon;

    console.log("FORECAST THREE DAYS2", threeDaysData);

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayLetter = ["S", "M", "T", "W", "T", "F", "S"];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

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

  const Graph = () => {
    if (error) return <h2>Error when fetching: {error}</h2>;
    if (!weatherData && isLoading) return <h2>LOADING...</h2>;
    if (!weatherData) return null;

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
        <XAxis stroke="#90CDF4" />
        <YAxis tick={false} />
        <Tooltip />
        <CartesianGrid stroke="#f5f5f5" stroke="none" />
        <Bar
          dataKey="chance_of_rain"
          name="Chance of rain"
          barSize={3}
          fill="#90CDF4"
        />
        <Line
          type="step"
          dataKey="activity"
          name="Activity"
          stroke="#FFF500"
          dot={false}
        />
      </ComposedChart>
    );
  };
  // chance_of_rain
  ///////////////////////////

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
          value={city}
          onChange={handleChange}
        ></Input>

        {WeatherChart()}

        <Flex alt="bottomContainer" flexDirection="column">
          {Graph()}
          <Flex flexDirection="row" justifyContent="space-between">
            <Flex flexDirection="column">
              <Text color="#FFFFFF" fontSize={10} textTransform="uppercase">
                Chance of rain
              </Text>
              <Text color="#FFFFFF" fontSize={10} textTransform="uppercase">
                Activity history
              </Text>
            </Flex>
            <Flex flexDirection="column" alignItems="center">
              <Text color="#FFFFFF">8:00-9:00PM</Text>
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

export default HolisticHealth;
