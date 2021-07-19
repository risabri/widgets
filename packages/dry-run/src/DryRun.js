import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { usePrifina } from "@prifina/hooks";

import useFetch from "./useFetch";

import { API_KEY, API_BASE_URL } from "./config";

import {
  Flex,
  ChakraProvider,
  Text,
  Box,
  IconButton,
  ButtonGroup,
  CircularProgress,
  Input,
  Stack,
} from "@chakra-ui/react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { SleepingEmoji } from "./assets/icons";
import { FireIcon } from "./assets/icons";
import { WalkIcon } from "./assets/icons";
import { HealthIcon } from "./assets/icons";
import { EditIcon } from "./assets/icons";
import { CloseIcon } from "./assets/icons";
import { CheckIcon } from "./assets/icons";

import { data } from "./data";

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

const legendStyle = {
  fontSize: 10,
};

const appID = "dryRun";

const HolisticHealth = (props) => {
  const { onUpdate, Prifina, API, registerHooks } = usePrifina();

  const prifina = new Prifina({ appId: appID });

  const { city, data } = props;

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

  const [searchCity, setCity] = useState("London");

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

  const { weatherData, error, isLoading, setUrl } = useFetch(
    `${API_BASE_URL}/data/2.5/weather?q=${searchCity}&units=metric&appid=${API_KEY}`
  );

  const forecastData = useFetch(
    `${API_BASE_URL}/data/2.5/forecast?q=${searchCity}&units=metric&appid=${API_KEY}`
  );

  //api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
  console.log("WEATHER DATA", weatherData);
  console.log("FORECAST DATA", forecastData);

  const getContent = () => {
    if (error) return <h2>Error when fetching: {error}</h2>;
    if (!weatherData && isLoading) return <h2>LOADING...</h2>;
    if (!weatherData) return null;
    console.log(JSON.stringify(weatherData));
    const icon = weatherData.weather[0].icon;
    const weatherCity = weatherData.name;
    return (
      <React.Fragment>
        <div
          style={{
            width: "200px",
            height: "200px",
            padding: "5px",
          }}
        >
          <div style={{ textAlign: "center", textTransform: "capitalize" }}>
            {weatherCity}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              height: "100px",
            }}
          >
            <img
              width={"100"}
              src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
            />
            <div style={{ width: "90px" }}>
              {Math.ceil(weatherData.main.temp)}
              {"°C"}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "100px",
                textAlign: "center",
                textTransform: "capitalize",
              }}
            >
              {weatherData.weather[0].description}
            </div>
            <div style={{ width: "90px" }} />
          </div>
        </div>
      </React.Fragment>
    );
  };
  ///////////////////////////

  const [step, setStep] = useState(0);

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
        ></Input>

        <Flex alt="weatherContainer" marginBottom="12px"></Flex>
        <Flex alt="graphContainer">
          <Text
            fontSize="18px"
            textTransform="uppercase"
            fontWeight="bold"
            fontStyle="italic"
            color="#FFFFFF"
          >
            Monday, 15 June
          </Text>
        </Flex>
        <Flex alt="bottomContainer" justifyContent="space-between">
          <Flex flexDirection="column">
            <Text color="#FFFFFF">sdasad</Text>
            <Text color="#FFFFFF">sdasad</Text>
          </Flex>
          <Flex>
            <Text color="#FFFFFF">8:00-9:00PM</Text>
          </Flex>
          {getContent()}
        </Flex>
      </Flex>
    </ChakraProvider>
  );
};

export default HolisticHealth;
