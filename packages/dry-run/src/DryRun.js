import React, { useState, useEffect } from "react";

import { usePrifina, Op } from "@prifina/hooks";

import Oura from "@prifina/oura";

import { Flex, Text, Input, Image } from "@chakra-ui/react";

import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  ComposedChart,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

import useFetch from "./hooks/useFetch";
import { API_KEY, API_BASE_URL } from "./config";
import { days, months, dayLetter } from "./utils/period";

const containerStyle = {
  width: "300px",
  height: "300px",
  background:
    "linear-gradient(180deg, #0D3D4D 0%, rgba(0, 44, 69, 0.04) 100%), #071833",
  borderRadius: "10px",
  boxShadow: "0px 2px 8px rgba(91, 92, 91, 0.2)",
  padding: 8,
  flexDirection: "column",
};

const appID = "3LSdcSs1kcPskBWBJvqGto";

const DryRun = (props) => {
  const { onUpdate, Prifina, API, registerHooks } = usePrifina();

  // const prifina = new Prifina({ appId: appID });
  const stage = props.stage || "prod";
  const { city, data } = props;

  const [ouraDays, setOuraDays] = useState({});
  const [weatherDay, setWeatherDay] = useState(0);

  const processData = (data) => {
    //console.log("DATA", data);

    let newArray = [];
    if (stage === "dev") {
      //let mockup = Object.assign({}, data);
      const parts = data.split(",");

      const mockup = { day_start: parts[2], class_5min: parts[6] };
      console.log(mockup);
      let newDate = new Date(mockup.day_start);
      newArray.push("day_start,class_5min");
      for (let i = 0; i < 7; i++) {
        const yesterdayTS = newDate.setDate(newDate.getDate() - 1);
        let newData = Object.assign({}, mockup);
        newData.day_start = new Date(yesterdayTS).toISOString();
        newArray.push(`${newData.day_start},${(newData, class_5min)}`);
        newDate = new Date(yesterdayTS);
      }
    } else {
      newArray = data;
    }
    newArray.shift(); // remove csv header ...
    console.log("PROCESS ", newArray);
    let activities = {};
    newArray.forEach((dd) => {
      //console.log("DD ", dd);

      const parts = dd.split(",");

      const dayStart = new Date(parts[0]).getTime();
      parts[1].split("").forEach((val, i) => {
        const ts = new Date(dayStart + i * 5 * 60 * 1000);
        //console.log(i, ts, parseInt(val) > 2);
        // '2021-12-30 00:00'  weather data ts...
        // weather time is local, so getHours() should be ok
        const day = ts.getDay();
        const dayHour = ts.getHours().toString().padStart(2, "0") + ":00";
        if (!activities.hasOwnProperty(day)) {
          activities[day] = {};
        }
        if (!activities[day].hasOwnProperty(dayHour)) {
          activities[day][dayHour] = 0;
        }
        if (parseInt(val) > 2) {
          activities[day][dayHour]++;
        }
      });
    });
    console.log(activities);

    /*
0: Non-wear
1: Rest (MET level below 1.05)
2: Inactive (MET level between 1.05 and 2)
3: Low intensity activity (MET level between 2 and age/gender dependent limit)
4: Medium intensity activity
5: High intensity activity
*/

    /*
const class_5min =
"1112211111111111111111111111111111111111111111233322322223333323322222220000000000000000000000000000000000000000000000000000000233334444332222222222222322333444432222222221230003233332232222333332333333330002222222233233233222212222222223121121111222111111122212321223211111111111111111"
 0123456789012345678901234567890123456789012345678901234567890123456789
           1         2         3         4         5         6  
*/

    setOuraDays(activities);
  };

  //console.log("CHECK CONNECTOR", connectorData);

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

  const dataUpdate = async (payload) => {
    console.log("UPDATE ", payload);
    if (
      payload.hasOwnProperty("settings") &&
      typeof data.settings === "object" &&
      payload.settings.hasOwnProperty("city")
    ) {
      setCity(payload.settings.city);
      setUrl(
        `${API_BASE_URL}/data/2.5/onecall?q=${data.settings.city}&units=metric&appid=${API_KEY}`
      );
    }

    if (
      payload.hasOwnProperty("data") &&
      payload.data.hasOwnProperty("content")
    ) {
      // process async data
      if (
        payload.data.dataconnector === "Oura/queryActivitySummariesAsync" &&
        payload.data.content.length > 1
      ) {
        processData(payload.data.content);
      }
    }
  };

  useEffect(async () => {
    // init callback function for background updates/notifications
    onUpdate(appID, dataUpdate);
    // register datasource modules
    registerHooks(appID, [Oura]);

    const d = new Date();

    const dd = d.setDate(d.getDate() - 14);
    const dateStr = new Date(dd).toISOString().split("T")[0];

    const filter = {
      ["s3::date"]: {
        [Op.gte]: dateStr,
      },
    };

    const activityResult = await API[appID].Oura.queryActivitySummariesAsync({
      filter: filter,
      fields: "day_start,class_5min",
    });
    console.log(activityResult);
    if (stage === "dev") {
      processData(activityResult.data.getDataObject.content[1]);
    }

    /*
    const result = await API[appID].Oura.queryActivitySummariesAsync({
      filter: filter,
    });

    console.log("RESULT ", result);

    processData(result.data.getDataObject.content[0]);
*/
    //needs solution this doesn't work
    // if (result.data.getDataObject.content.activity.length > 0) {
    //   processData(result.data.getDataObject.content.activity);
    // }
  }, []);

  const { weatherData, error, isLoading, setUrl } = useFetch(
    // free api only sends 3 days of data...
    `${API_BASE_URL}/v1/forecast.json?key=${API_KEY}&q=${searchCity}&days=7&aqi=no&alerts=no`
  );

  if (error) return <h2>Error when fetching: {error}</h2>;
  if (!weatherData && isLoading) return <h2>LOADING...</h2>;
  if (!weatherData) return null;

  const timeFormat = (time, idx, postFix = true) => {
    //console.log(tickItem);
    const parts = time.split(":");
    const hour = parseInt(parts[0]);
    //console.log("FORMAT ", time, postFix);
    if (hour > 0 && hour < 12) {
      return hour + (idx === -1 ? ":" + parts[1] : "") + (postFix ? "AM" : "");
    } else if (hour > 12 && hour < 24) {
      return (
        hour - 12 + (idx === -1 ? ":" + parts[1] : "") + (postFix ? "PM" : "")
      );
    } else if (hour === 12) {
      return hour + (idx === -1 ? ":" + parts[1] : "") + (postFix ? "PM" : "");
    } else if (hour === 24) {
      return "12" + (idx === -1 ? ":" + parts[1] : "") + (postFix ? "AM" : "");
    } else if (hour === 0) {
      return "12" + (idx === -1 ? ":" + parts[1] : "") + (postFix ? "AM" : "");
    }
  };
  const dayClick = (event) => {
    //console.log("EV ", event);
    //console.log(event.currentTarget.dataset);
    const dayIndex = parseInt(event.currentTarget.dataset.weatherDay);
    //console.log(dayIndex);
    if (weatherDay != dayIndex) {
      setWeatherDay(dayIndex);
    } else {
      event.preventDefault();
    }
  };
  const weatherChart = () => {
    const forecastData = weatherData.forecast.forecastday.map((w) => {
      return { icon: w.day.condition.icon, date: w.date };
    });
    //console.log("WWWW ", weatherData);

    const currentDay = new Date(forecastData[weatherDay].date);
    return (
      <Flex flexDirection="column">
        <Flex justifyContent="center">
          {forecastData.map((w, i) => (
            <Flex
              key={"w-" + i}
              flexDirection="column"
              alignItems="center"
              data-weather-day={i}
              onClick={(e) => dayClick(e)}
              style={{ cursor: "pointer" }}
            >
              <Image src={w.icon} boxSize="40px" />
              <Text color="#FFF500" fontWeight="700" fontSize="12px">
                {dayLetter[new Date(w.date).getDay()]}
              </Text>
            </Flex>
          ))}
        </Flex>
        <Text
          fontSize="18px"
          textTransform="uppercase"
          fontWeight="bold"
          fontStyle="italic"
          color="#FFFFFF"
        >
          {days[currentDay.getDay()]}, {currentDay.getDate()}{" "}
          {months[currentDay.getMonth()]}
        </Text>
      </Flex>
    );
  };

  const graph = () => {
    const forecastData = weatherData.forecast.forecastday[weatherDay];
    //ts.getDay() + "#" + ts.getHours().toString().padStart(2, "0") + ":00";
    const forecastDay = new Date(forecastData.date).getDay();
    console.log("FORECAST DAY", forecastDay);
    let amountOfExcersises = 0;
    const combinedData = forecastData.hour.map((d) => {
      const forecastDayHour = d.time.split(" ")[1];
      let excerciseAmount = 0;
      if (
        ouraDays.hasOwnProperty(forecastDay) &&
        ouraDays[forecastDay].hasOwnProperty(forecastDayHour)
      ) {
        excerciseAmount = ouraDays[forecastDay][forecastDayHour];
      }
      //amountOfExcersises += excerciseAmount;
      amountOfExcersises = Math.max(amountOfExcersises, excerciseAmount);
      return {
        hour: d.time.split(" ")[1],
        chance_of_rain: (d.chance_of_rain + d.chance_of_snow) / 2,
        activity: excerciseAmount,
      };
    });
    //console.log("CHART ", amountOfExcersises, combinedData);

    return (
      <ResponsiveContainer width="99%" aspect={3}>
        <ComposedChart
          data={combinedData}
          borderWidth={0}
          margin={{ left: -55, right: -55, top: 10 }}
        >
          <XAxis
            stroke="#90CDF4"
            dataKey="hour"
            fontSize="12px"
            tickFormatter={timeFormat}
            tick={{ fontSize: 10 }}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            tick={false}
            domain={[0, 100]}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={false}
            domain={[0, amountOfExcersises]}
          />
          <Tooltip />
          <CartesianGrid stroke="#f5f5f5" stroke="none" />
          <Bar
            dataKey="chance_of_rain"
            yAxisId="left"
            name="Chance of rain"
            barSize={3}
            fill="#90CDF4"
            radius={3}
            maxBarSize={4}
          />
          <Line
            yAxisId="right"
            type="step"
            dataKey="activity"
            name="Activity"
            stroke="#FFF500"
            dot={false}
          />
          <ReferenceLine yAxisId="left" x={"06:00"} stroke="#808080" />
          <ReferenceLine yAxisId="left" x={"12:00"} stroke="#808080" />
          <ReferenceLine yAxisId="left" x={"18:00"} stroke="#808080" />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  function compare(a, b) {
    //console.log(a, b);
    const aKeys = Object.keys(a)[0];
    const bKeys = Object.keys(b)[0];
    if (a[aKeys] < b[bKeys]) {
      return 1;
    }
    if (a[aKeys] > b[bKeys]) {
      return -1;
    }
    return 0;
  }
  const forecastData = weatherData.forecast.forecastday[weatherDay];
  //ts.getDay() + "#" + ts.getHours().toString().padStart(2, "0") + ":00";
  const forecastDay = new Date(forecastData.date).getDay();

  let optimalHour = -1;
  let sortedActivityHours = [];
  // sort activities most activities first....
  if (ouraDays.hasOwnProperty(forecastDay)) {
    sortedActivityHours = Object.keys(ouraDays[forecastDay])
      .map((k) => {
        const aa = {};
        aa[k] = ouraDays[forecastDay][k];
        return aa;
      })
      .sort(compare)
      .slice(0, 3);
  }
  let rainProbability = 100;
  if (sortedActivityHours.length > 0) {
    console.log(sortedActivityHours);

    for (
      let w = 0;
      w < weatherData.forecast.forecastday[weatherDay].hour.length;
      w++
    ) {
      let amountOfActivities = 0;
      for (let i = 0; i < sortedActivityHours.length; i++) {
        const activityHour = Object.keys(sortedActivityHours[i])[0];

        const forecast = weatherData.forecast.forecastday[weatherDay].hour[w];
        const forecastDateHour = forecast.time.split(" ")[1];

        if (forecastDateHour === activityHour) {
          console.log(
            forecastDateHour,
            activityHour,
            sortedActivityHours[i][activityHour],
            amountOfActivities
          );

          if (
            forecast.chance_of_rain + forecast.chance_of_snow <=
              rainProbability &&
            sortedActivityHours[i][activityHour] > amountOfActivities
          ) {
            amountOfActivities = sortedActivityHours[i][activityHour];
            optimalHour = parseInt(activityHour);
            rainProbability = forecast.chance_of_rain + forecast.chance_of_snow;
          }
        }
      } // sorted activities...
    }
    console.log("RAIN % ", rainProbability);
  }
  // if we didn't find anything... or if it is still more than 20% change of rain
  if (optimalHour === -1 || rainProbability > 20) {
    const trainingHours = weatherData.forecast.forecastday[
      weatherDay
    ].hour.slice(6, 20);

    //hmm,... this only selects latests possible time. Not really optimal time to excersise... not using activity frequency???
    let optimalHourDate = trainingHours.reduce((prev, curr) =>
      prev.chance_of_rain < curr.chance_of_rain + curr.chance_of_snow
        ? prev
        : curr
    );

    let h = optimalHourDate.time;
    optimalHour = new Date(h).getHours();
  }

  // this now always "00"
  //const optimalMins = new Date(h).getMinutes().toString().padStart(2, "0");
  const optimalMins = "00";

  return (
    <>
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
          readOnly
        />

        {weatherChart()}

        <Flex alt="bottomContainer" flexDirection="column">
          {graph()}
          <Flex
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
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
              >{`${timeFormat(
                optimalHour + ":" + optimalMins,
                -1,
                false
              )} - ${timeFormat(
                optimalHour + 1 + ":" + optimalMins,
                -1,
                true
              )}`}</Text>

              <Text textTransform="uppercase" color="#FFF500" fontSize={10}>
                Optimal workout time
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default DryRun;
