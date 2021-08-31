import React, { useState, useEffect } from "react";
import useFetch from "./hooks/useFetch";

import { usePrifina } from "@prifina/hooks";
import { API_KEY, API_BASE_URL } from "./apis/config";

import { Flex, ChakraProvider, Text, Image } from "@chakra-ui/react";

import { LocationIcon } from "./assets/icons";
import { ChevronRight } from "./assets/icons";
import { ChevronLeft } from "./assets/icons";

import { days, months } from "./utils/periods";

import { getDayIcon, getNightIcon } from "./utils/iconsMap";

const containerStyle = {
  width: "308px",
  height: "296px",
  borderRadius: "10px",
  boxShadow: "0px 2px 8px rgba(91, 92, 91, 0.2)",
  paddingTop: 31,
  flexDirection: "column",
  justifyContent: "space-between",
};

// unique appID for the widget....
const appID = "weatherWidget";

const App = (props) => {
  console.log("WEATHER WIDGET PROPS ", props);

  const [active, setActive] = useState(true);

  const { city, data } = props;
  //const city = "san francisco";

  // init hook and get provider api services...
  const { onUpdate, Prifina } = usePrifina();

  // init provider api with your appID
  const prifina = new Prifina({ appId: appID });
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
    // should check the data payload... :)

    if (
      data.hasOwnProperty("settings") &&
      typeof data.settings === "object" &&
      data.settings.hasOwnProperty("city")
    ) {
      setCity(data.settings.city);
      setUrl(
        `${API_BASE_URL}/data/2.5/weather?q=${data.settings.city}&units=metric&appid=${API_KEY}`
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

  ////background
  if (error) return <h2>Error when fetching: {error}</h2>;
  if (!weatherData && isLoading) return <h2>LOADING...</h2>;
  if (!weatherData) return null;

  const currentCondition = weatherData.current.condition.text;

  const isDay = weatherData.current.is_day;

  const locationTime = weatherData.location.localtime;

  var time = new Date(locationTime);
  const currentTime = time.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const dayBackground1 = "linear-gradient(180deg, #A9E8FC 0%, #2774D2 100%)";
  const dayBackground2 =
    " linear-gradient(180deg, #C4E0E5 0%, #58A8C5 30.73%, #2571A4 88.54%)";
  const dayBackground3 = "linear-gradient(180deg, #D2DEEA 0%, #00416A 100%)";
  const dayBackground4 = "linear-gradient(180deg, #F2FCFE 0%, #1C92D2 100%)";

  const nightBackground1 = "linear-gradient(180deg, #2B5876 0%, #4E4376 100%)";
  const nightBackground2 = "linear-gradient(180deg, #A6BED0 0%, #1C242C 100%)";
  const nightBackground3 =
    "linear-gradient(180deg, #223548 16.17%, #166293 100%)";
  const nightBackground4 = "linear-gradient(180deg, #808080 0%, #191654 100%)";

  const background1 = isDay < 1 ? nightBackground1 : dayBackground1;
  const background2 = isDay < 1 ? nightBackground2 : dayBackground2;
  const background3 = isDay < 1 ? nightBackground3 : dayBackground3;
  const background4 = isDay < 1 ? nightBackground4 : dayBackground4;

  const conditionCode = weatherData.current.condition.code;

  console.log("CONDITION CODE", conditionCode);

  let customIcon = getDayIcon(conditionCode);

  var bg = background1;

  ///backgrounds

  switch (conditionCode) {
    case 1000:
    case 1003:
    case 1006:
      bg = background1;
      break;
    case 1009:
    case 1063:
    case 1192:
    case 1183:
    case 1186:
    case 1189:
    case 1153:
    case 1195:
      bg = background2;
      break;
    case 1273:
    case 1246:
    case 1276:
    case 1087:
    case 1279:
    case 1282:
      bg = background3;
      break;
    case 1030:
    case 1066:
    case 1069:
    case 1072:
    case 1114:
    case 1117:
    case 1135:
    case 1147:
    case 1150:
    case 1168:
    case 1171:
    case 1180:
    case 1198:
    case 1201:
    case 1204:
    case 1207:
    case 1210:
    case 1213:
    case 1216:
    case 1219:
    case 1222:
    case 1225:
    case 1237:
    case 1240:
    case 1243:
    case 1249:
    case 1252:
    case 1255:
    case 1258:
    case 1261:
    case 1264:
      bg = background4;
      break;
    default:
      bg = background1;
  }

  ////icons

  if (isDay < 1) {
    customIcon = getNightIcon(conditionCode);
  }

  const getContent = () => {
    if (error) return <h2>Error when fetching: {error}</h2>;
    if (!weatherData && isLoading) return <h2>LOADING...</h2>;
    if (!weatherData) return null;

    console.log("WEATHER DATA", weatherData);

    const currentTemperature = weatherData.current.temp_c;

    const location = weatherData.location.name;
    const locationTime = weatherData.location.localtime;

    var time = new Date(locationTime);
    const currentTime = time.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return (
      <Flex justifyContent="center">
        <Flex paddingRight="17px">
          <Image src={customIcon} boxSize="100px" />
        </Flex>
        <Flex
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="center"
        >
          <Flex alt="location" justifyContent="center">
            <LocationIcon />
            <Text fontSize="14px" fontWeight="400" color="white">
              {location}
            </Text>
          </Flex>
          <Flex alt="location" alignItems="baseline">
            <Text
              paddingRight="3px"
              fontWeight="600"
              fontSize="24px"
              color="white"
            >
              {Math.round(currentTemperature)}°
            </Text>
            <Text fontWeight="600" fontSize="16px" color="white">
              {currentCondition}
            </Text>
          </Flex>
          <Text fontSize="14px" fontWeight="400" color="white">
            {currentTime}
          </Text>
        </Flex>
      </Flex>
    );
  };

  const getForecast = () => {
    if (error) return <h2>Error when fetching: {error}</h2>;
    if (!weatherData && isLoading) return <h2>LOADING...</h2>;
    if (!weatherData) return null;

    console.log("WEATHER DATA", weatherData);

    const locationTime = weatherData.location.localtime;

    var time = new Date(locationTime).getHours();

    console.log("sdadsasda", time);

    const hourData = [
      ...weatherData.forecast.forecastday[0].hour,
      ...weatherData.forecast.forecastday[1].hour,
    ];

    const sixHourData = hourData.slice(time, time + 6);
    const sixHourData2 = hourData.slice(time + 6, time + 12);

    console.log("HOUR DATA", hourData);
    console.log("SIX HOUR DATA", sixHourData);

    console.log("SIX HOUR 2 DATA", sixHourData2);

    const activeArray = active ? sixHourData : sixHourData2;

    return active ? (
      <Flex
        paddingLeft="41px"
        paddingRight="20px"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        {activeArray.map(function (item, i) {
          const customIcon =
            isDay === 1
              ? getDayIcon(item.condition.code)
              : getNightIcon(item.condition.code);
          var time = new Date(item.time);
          const currentTime = time.toLocaleString("en-US", {
            hour: "numeric",
            hour12: true,
          });
          return (
            <Flex flexDirection="column" alignItems="center">
              <Text fontSize="10px" fontWeight="600" color="white">
                {currentTime}
              </Text>
              <Image src={customIcon} boxSize="22px" />
              <Text key={i} fontSize="12px" fontWeight="600" color="white">
                {Math.round(item.temp_c)}
              </Text>
            </Flex>
          );
        })}
        <div onClick={() => setActive(!active)}>
          <ChevronRight />
        </div>
      </Flex>
    ) : (
      <Flex
        paddingLeft="20px"
        paddingRight="20px"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <div onClick={() => setActive(!active)}>
          <ChevronLeft />
        </div>
        {activeArray.map(function (item, i) {
          const customIcon =
            isDay === 1
              ? getDayIcon(item.condition.code)
              : getNightIcon(item.condition.code);
          var time = new Date(item.time);
          const currentTime = time.toLocaleString("en-US", {
            hour: "numeric",
            hour12: true,
          });
          return (
            <Flex flexDirection="column" alignItems="center">
              <Text fontSize="10px" fontWeight="600" color="white">
                {currentTime}
              </Text>
              <Image src={customIcon} boxSize="22px" />
              <Text key={i} fontSize="12px" fontWeight="600" color="white">
                {Math.round(item.temp_c)}
              </Text>
            </Flex>
          );
        })}
        <div>
          <ChevronRight />
        </div>
      </Flex>
    );
  };

  const bottomContainer = () => {
    if (error) return <h2>Error when fetching: {error}</h2>;
    if (!weatherData && isLoading) return <h2>LOADING...</h2>;
    if (!weatherData) return null;

    const threeDaysData = weatherData.forecast.forecastday;

    const day2 = threeDaysData[1].date;
    const day3 = threeDaysData[2].date;

    const newDate2 = new Date(day2);
    const newDate3 = new Date(day3);

    const dayDisplay3 = days[newDate3.getDay()];

    const date2 = new Date(day2);
    const date3 = new Date(day3);

    const dateNumber2 = date2.getDate();
    const month2 = months[date2.getMonth()];
    const dateNumber3 = date3.getDate();
    const month3 = months[date3.getMonth()];

    console.log("Three day DATA", threeDaysData);

    const icon2 =
      isDay === 1
        ? getDayIcon(threeDaysData[1].day.condition.code)
        : getNightIcon(threeDaysData[1].day.condition.code);
    const icon3 =
      isDay === 1
        ? getDayIcon(threeDaysData[2].day.condition.code)
        : getNightIcon(threeDaysData[2].day.condition.code);

    console.log("ICON", icon2);
    console.log("IS LOADING", isLoading);

    const day2Min = threeDaysData[1].day.mintemp_c;
    const day2Max = threeDaysData[1].day.maxtemp_c;
    const day3Min = threeDaysData[2].day.mintemp_c;
    const day3Max = threeDaysData[2].day.maxtemp_c;

    return (
      <Flex
        paddingLeft="25px"
        paddingRight="29px"
        marginBottom="28px"
        justifyContent="space-between"
      >
        <Flex flexDirection="column">
          <Text fontSize="14px" fontWeight="600" color="white">
            Tomorrow, {dateNumber2} {month2}
          </Text>
          <Text fontSize="14px" fontWeight="600" color="white">
            {dayDisplay3}, {dateNumber3} {month3}
          </Text>
        </Flex>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          flexDirection="column"
        >
          <Image src={icon3} boxSize="22px" />
          <Image src={icon2} boxSize="22px" />
        </Flex>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          flexDirection="column"
        >
          <Text fontSize="14px" fontWeight="600" color="white">
            {Math.round(day2Min)}°/ {Math.round(day2Max)}°
          </Text>
          <Text fontSize="14px" fontWeight="600" color="white">
            {Math.round(day3Min)}°/ {Math.round(day3Max)}°
          </Text>
        </Flex>
      </Flex>
    );
  };

  return (
    <ChakraProvider>
      {isLoading === false && (
        <Flex alt="container" style={containerStyle} flex={1} bg={bg}>
          {getContent()}

          {getForecast()}

          {bottomContainer()}
        </Flex>
      )}
    </ChakraProvider>
  );
};
App.defaultProps = {
  city: "San Francisco",
};
App.displayName = "Weather";

export default App;
