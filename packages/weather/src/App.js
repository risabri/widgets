import React, { useState, useEffect } from "react";
import useFetch from "./hooks/useFetch";

import { usePrifina } from "@prifina/hooks";
import { API_KEY, API_BASE_URL } from "./apis/config";

import {
  Flex,
  ChakraProvider,
  Text,
  Input,
  Image,
  Icon,
} from "@chakra-ui/react";

import { LocationIcon } from "./assets/icons";

const containerStyle = {
  width: "308px",
  height: "296px",
  borderRadius: "30px",
  boxShadow: "0px 2px 8px rgba(91, 92, 91, 0.2)",
  paddingTop: 31,
  flexDirection: "column",
  justifyContent: "space-between",
};

// unique appID for the widget....
const appID = "weatherWidget";

const App = (props) => {
  console.log("WEATHER WIDGET PROPS ", props);

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

  // const { weatherData, error, isLoading, setUrl } = useFetch(
  //   `${API_BASE_URL}/data/2.5/weather?q=${searchCity}&units=metric&appid=${API_KEY}`
  // );

  const { weatherData, error, isLoading, setUrl } = useFetch(
    `${API_BASE_URL}/v1/forecast.json?key=${API_KEY}&q=${searchCity}&days=3&aqi=no&alerts=no`
  );
  //api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

  ////background
  if (error) return <h2>Error when fetching: {error}</h2>;
  if (!weatherData && isLoading) return <h2>LOADING...</h2>;
  if (!weatherData) return null;
  const currentCondition = weatherData.current.condition.text;

  const isDay = weatherData.current.is_day;
  const sunrise = weatherData.forecast.forecastday[0].astro.sunrise;
  const sunset = weatherData.forecast.forecastday[0].astro.sunset;

  const locationTime = weatherData.location.localtime;
  console.log("locationTime", locationTime);
  console.log("sunrise", sunrise);

  var time = new Date(locationTime);
  const currentTime = time.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  console.log("currentTime", currentTime);

  console.log("is day", isDay);
  console.log("is condition", currentCondition);

  let bg = "linear-gradient(180deg, #C6E0E9 0%, #0092FF 100%)";
  const clear = "linear-gradient(180deg, #C6E0E9 0%, #0092FF 100%)";
  const cloudy =
    "linear-gradient(180deg, #C4E0E5 0%, #58A8C5 30.73%, #2571A4 88.54%)";
  const clearNight = "linear-gradient(180deg, #2B5876 0%, #4E4376 100%)";
  const cloudyNight = "linear-gradient(180deg, #928DAB 0%, #1F1C2C 100%)";

  if (currentTime >= sunrise && currentTime <= sunset) {
    switch (currentCondition) {
      case "Clear":
        bg = clear;
        break;
      case "cloudy":
        bg = cloudy;
        break;
      case "Partly cloudy":
        bg = clear;
        break;
      default:
        bg = clear;
    }
  } else {
    switch (currentCondition) {
      case "Clear":
        bg = clearNight;
        break;
      case "cloudy":
        bg = cloudyNight;
        break;
      case "Partly cloudy":
        bg = clearNight;
        break;

      default:
        bg = clearNight;
    }
  }
  /////////////
  const getContent = () => {
    if (error) return <h2>Error when fetching: {error}</h2>;
    if (!weatherData && isLoading) return <h2>LOADING...</h2>;
    if (!weatherData) return null;

    console.log("WEATHER DATA", weatherData);

    const currentTemperature = weatherData.current.temp_c;
    const currentCondition = weatherData.current.condition.text;
    const currentIcon = weatherData.current.condition.icon;

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
          <Image src={currentIcon} boxSize="100px" />
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
              {currentTemperature}°
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

  const bottomContainer = () => {
    if (error) return <h2>Error when fetching: {error}</h2>;
    if (!weatherData && isLoading) return <h2>LOADING...</h2>;
    if (!weatherData) return null;

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
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

    const threeDaysData = weatherData.forecast.forecastday;

    const day2 = threeDaysData[1].date;
    const day3 = threeDaysData[2].date;

    const newDate2 = new Date(day2);
    const newDate3 = new Date(day3);

    const dayDisplay2 = days[newDate2.getDay()];
    const dayDisplay3 = days[newDate3.getDay()];

    const date2 = new Date(day2);
    const date3 = new Date(day3);

    const dateNumber2 = date2.getDate();
    const month2 = months[date2.getMonth()];
    const dateNumber3 = date3.getDate();
    const month3 = months[date3.getMonth()];

    console.log("Three day DATA", threeDaysData);

    const icon2 = threeDaysData[1].day.condition.icon;
    const icon3 = threeDaysData[2].day.condition.icon;

    console.log("ICON", icon2);

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
            {/* {day2Min}°/ {day2Max}° */}
          </Text>
          <Text fontSize="14px" fontWeight="600" color="white">
            {Math.round(day3Min)}°/ {Math.round(day3Max)}°
            {/* {day3Min}°/ {day3Max}° */}
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

    const hourData = weatherData.forecast.forecastday[0].hour;

    const sixHourData = hourData.slice(time, time + 6);

    console.log("HOUR DATA", hourData);

    const hourTime = sixHourData.time;

    console.log("HOUR time", hourTime);

    return (
      <Flex
        paddingLeft="35px"
        paddingRight="35px"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        {sixHourData.map(function (item, i) {
          var time = new Date(item.time);
          const currentTime = time.toLocaleString("en-US", {
            hour: "numeric",
            // minute: "numeric",
            hour12: true,
          });

          return (
            <Flex flexDirection="column" alignItems="center">
              <Text fontSize="10px" fontWeight="600" color="white">
                {currentTime}
              </Text>
              <Image src={item.condition.icon} boxSize="22px" />
              <Text key={i} fontSize="12px" fontWeight="600" color="white">
                {/* {item.temp_c} */}
                {Math.round(item.temp_c)}
              </Text>
            </Flex>
          );
        })}
      </Flex>
    );
  };

  return (
    <ChakraProvider>
      <Flex alt="container" style={containerStyle} flex={1} bg={bg}>
        {getContent()}

        {getForecast()}

        {bottomContainer()}
      </Flex>
    </ChakraProvider>
  );
};
App.defaultProps = {
  city: "San Francisco",
};
App.displayName = "Weather";

export default App;

{
  /* 
        <CitySelector onSearch={(city) => setUrl(`${API_BASE_URL}/data/2.5/forecast?q=${city}&cnt=5&appid=${API_KEY}`)} />
  */
}
{
  /* conditionally render  */
}
