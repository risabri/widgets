import React, { useState, useEffect } from "react";

import { usePrifina, Op } from "@prifina/hooks";

import Oura from "@prifina/oura";

import {
  Flex,
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

import {
  SleepingEmoji,
  FireIcon,
  WalkIcon,
  HealthIcon,
  EditIcon,
  CloseIcon,
  CheckIcon,
} from "./assets/icons";

const containerStyle = {
  width: "300px",
  height: "300px",
  background: "#29043B",
  borderRadius: "10px",
  boxShadow: "0px 2px 8px rgba(91, 92, 91, 0.2)",
  padding: 7,
  flexDirection: "column",
  paddingTop: 25,
};

const legendStyle = {
  fontSize: 10,
};

const circularProgressStyle = {
  position: "absolute",
  borderRadius: 10,
  thickness: 10,
  transform: "rotate(180deg)",
};

const CustomButton = ({ icon, current, onClick, goal, unit }) => {
  return (
    <Box
      as="button"
      height="32px"
      width="132px"
      lineHeight="1.2"
      transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
      px="8px"
      borderRadius="5px"
      fontSize="10px"
      fontWeight="bold"
      bg="transparent"
      color="#4b4f56"
      border={0}
      _hover={{ bg: "#39114F" }}
      _active={{
        bg: "#39114F",
        transform: "scale(0.98)",
      }}
      _focus={{
        boxShadow:
          "0 0 1px 2px rgba(88, 144, 255, .75), 0 1px 1px rgba(0, 0, 0, .15)",
        bg: "#39114F",
      }}
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
      alignItems="center"
      onClick={onClick}
    >
      {icon}
      <Flex paddingLeft="9px" alignItems="baseline">
        <Text paddingRight="3px" fontSize="12px" color="white" fontWeight="700">
          {current}
        </Text>
        <Text paddingRight="3px" fontSize="9px" color="white" fontWeight="400">
          /{goal}
        </Text>
        <Text fontSize="10px" color="white" fontWeight="400">
          {unit}
        </Text>
      </Flex>
    </Box>
  );
};

const Card = ({ icon, title, subtitle, unit }) => {
  return (
    <Flex
      height="63.5px"
      width="93px"
      padding="6px"
      borderRadius="5px"
      bg="#39114F"
      flexDirection="column"
      alignItems="space-between"
    >
      {icon}
      <Flex alignItems="baseline">
        <Text fontSize="16px" fontWeight="700" color="#F6F6F6">
          {title}
        </Text>
        <Text
          fontSize="10px"
          fontWeight="400"
          color="#F6F6F6"
          paddingLeft="3px"
        >
          {unit}
        </Text>
      </Flex>

      <Text fontSize="10px" fontWeight="700" color="#ADADAD">
        {subtitle}
      </Text>
    </Flex>
  );
};

const appID = "sCUiMz2m9JsRSnRJ5favnP";

const HolisticHealth = (props) => {
  const stage = props.stage || "prod";

  const { onUpdate, Prifina, API, registerHooks } = usePrifina();

  const [ouraActivity, setOuraActivity] = useState();
  const [ouraSleep, setOuraSleep] = useState();
  //const [lastObject, setLastObject] = useState();

  const [hours, setHours] = useState("9");
  //32400
  const [calories, setCalories] = useState("1000");
  const [totalSteps, setTotalSteps] = useState("10000");

  const [achievedHours, setAchievedHours] = useState("8");
  const [achievedCalories, setAchievedCalories] = useState("2000");
  const [achievedTotalSteps, setAchievedTotalSteps] = useState();

  const [weeklyAvgHours, setWeeklyAvgHours] = useState("7.5");
  const [weeklyAvgCalories, setWeeklyAvgCalories] = useState("2100");
  const [weeklyAvgSteps, setWeeklyAvgSteps] = useState("12000");

  ///function converts seconds to time format
  function toTime(seconds) {
    var date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  }

  const processActivityData = (data) => {
    //console.log("PROCESS ACTIVITY DATA", data);
    let newArray = [];
    if (stage === "dev") {
      //create 7 days of data from one day data model
      const makeRepeated = (arr, repeats) =>
        Array.from({ length: repeats }, () => arr).flat();

      newArray = makeRepeated([data], 7);
      //console.log("new", newArray);
    } else {
      let activityData = [];

      // 0-index is csv-header..
      for (let i = 1; i < data.length; i++) {
        // csv data is comma separated...
        const r = data[i].split(",");
        //const activityDay = r[0].split("T")[0];
        const activityDay = r[0];
        activityData.push({
          summary_date: activityDay,
          cal_total: parseInt(r[1]) || 0,
          steps: parseInt(r[2]) || 0,
        });
      }

      newArray = activityData;
    }

    console.log("ACTIVITY ", newArray);

    setOuraActivity(newArray);
    //let totalSteps = newArray.map((a) => a.steps);
    //let totalCalories = newArray.map((a) => a.cal_total);

    //const sum = totalSteps.reduce((a, b) => a + b, 0);

    const weekTotalCalories = newArray.map((a) => a.cal_total);
    const weekTotalSteps = newArray.map((a) => a.steps);

    const caloriesSum = weekTotalCalories.reduce((a, b) => a + b, 0);
    const caloriesAvg = Math.round(caloriesSum / weekTotalCalories.length || 0);

    const stepsSum = weekTotalSteps.reduce((a, b) => a + b, 0);

    const stepsAvg = Math.round(stepsSum / weekTotalSteps.length || 0);

    setWeeklyAvgCalories(caloriesAvg);
    setWeeklyAvgSteps(stepsAvg);

    const lastActivity = newArray[newArray.length - 1];
    //setLastObject(lastActivity);
    setAchievedCalories(lastActivity.cal_total);
    setAchievedTotalSteps(lastActivity.steps);
  };

  const processSleepData = (data) => {
    let newArray = [];
    if (stage === "dev") {
      //create 7 days of data from one day data model
      const makeRepeated = (arr, repeats) =>
        Array.from({ length: repeats }, () => arr).flat();

      newArray = makeRepeated([data], 7);
      //console.log("7daysleepdata", newArray);
    } else {
      /*
      "summary_date, 0
      period_id, 1
      is_longest, 2
      timezone, 3
      bedtime_end, 4
      bedtime_start, 5
      breath_average, 6
      duration, 7
      total, 8
     awake, 9
     rem, 10
     deep, 11
     light, 12
     midpoint_time,efficiency,restless,onset_latency,hr_5min,hypnogram_5min,rmssd,rmssd_5min,
     score,score_alignment,score_deep,score_disturbances,score_efficiency,score_latency,score_rem,score_total,
     temperature_deviation,temperature_trend_deviation,bedtime_start_delta,bedtime_end_delta,midpoint_at_delta,
     temperature_delta,hr_lowest,hr_average,user,day\"
     */
      let sleepData = [];
      // 0-index is csv-header..
      for (let i = 1; i < data.length; i++) {
        // csv data is comma separated...
        const r = data[i].split(",");
        //const sleepDay = r[0].split("T")[0];

        const sleepDay = r[0];
        if (
          sleepData.some((d) => {
            return d.summary_date === sleepDay;
          })
        ) {
          sleepData[sleepDay].total += parseInt(r[1]);
          sleepData[sleepDay].awake += parseInt(r[2]);
          sleepData[sleepDay].rem += parseInt(r[3]);
          sleepData[sleepDay].deep += parseInt(r[4]);
          sleepData[sleepDay].light += parseInt(r[5]);
        } else {
          sleepData.push({
            summary_date: sleepDay,
            total: parseInt(r[1]) || 0,
            awake: parseInt(r[2]) || 0,
            rem: parseInt(r[3]) || 0,
            deep: parseInt(r[4]) || 0,
            light: parseInt(r[5]) || 0,
          });
        }
      }
      newArray = sleepData;
    }

    let sleep = newArray.map((a) => {
      return a.total;
    });

    const sleepSum = sleep.reduce((a, b) => a + b, 0);
    // sleep days is not same as array length... if takes naps... but data was processed already
    const sleepAvg = sleepSum / sleep.length || 0;

    console.log("SLEEP ", newArray);
    //console.log("SLEEP ", sleep, sleepSum, sleepAvg);

    const weeklyAvgHours = toTime(sleepAvg);

    setWeeklyAvgHours(weeklyAvgHours);
    setOuraSleep(newArray);
    const lastSleep = newArray[newArray.length - 1];

    setAchievedHours(lastSleep.total);
  };

  const dataUpdate = async (payload) => {
    // should check the data payload... :)
    console.log("DATA UPDATE ", payload);
    // does not have settings....
    /*
    if (
      payload.hasOwnProperty("settings") &&
      typeof payload.settings === "object" 
    ) {
     // process settings
    }
    */

    if (
      payload.hasOwnProperty("data") &&
      payload.data.hasOwnProperty("content")
    ) {
      // process async data
      if (payload.data.dataconnector === "Oura/queryActivitySummariesAsync") {
        processActivityData(payload.data.content);
      }

      if (payload.data.dataconnector === "Oura/querySleepSummariesAsync") {
        processSleepData(payload.data.content);
      }
    }
  };

  useEffect(async () => {
    // init callback function for background updates/notifications
    onUpdate(appID, dataUpdate);
    // register datasource modules
    registerHooks(appID, [Oura]);

    const d = new Date();
    // 8 days ago... because current day data may not exists yet...
    const dd = d.setDate(d.getDate() - 8);
    const dateStr = new Date(dd).toISOString().split("T")[0];

    const filter = {
      ["s3::date"]: {
        [Op.gte]: dateStr,
      },
    };

    const activityResult = await API[appID].Oura.queryActivitySummariesAsync({
      filter: filter,
      fields: "summary_date,cal_total,steps",
    });

    const sleepResult = await API[appID].Oura.querySleepSummariesAsync({
      filter: filter,
      fields: "summary_date,total,awake,rem,deep,light",
    });

    //needs to be handled in if loop doesn't work
    // if (activityResult.data.getDataObject.content.length > 0) {
    //   processActivityData(activityResult.data.getDataObject.content.activity);
    // }
    // Async queries are not returing result sets...
    //processSleepData(sleepResult.data.getDataObject.content);
    //processActivityData(activityResult.data.getDataObject.content.activity);
    if (stage === "dev") {
      processSleepData(sleepResult.data.getDataObject.content);
      processActivityData(activityResult.data.getDataObject.content.activity);
    }
  }, []);

  const [step, setStep] = useState(0);

  switch (step) {
    case 0:
      break;
    case 1:
      break;
    case 2:
      break;
    case 3:
      break;
    case 4:
      break;
    default:
  }

  const hrsToSeconds = hours * 3600;

  ///CircleProgressBar Percentage values
  const hoursPercentage = (achievedHours / hrsToSeconds) * 100;
  const caloriesPercentage = (achievedCalories / calories) * 100;
  const stepsPercentage = (achievedTotalSteps / totalSteps) * 100;

  ///7 days averages

  return (
    <>
      {step === 0 && (
        <Flex alt="container" style={containerStyle} flex={1}>
          <Text fontSize="16px" color="#3271E6" fontWeight="bold">
            Holistic Health
          </Text>
          <Flex alt="uppperContaner">
            <Flex alt="leftSide" flexDirection="column" flex={2}>
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="12px" color="#F6F6F6" fontWeight="bold">
                  Daily Goals
                </Text>
                <IconButton
                  style={{
                    border: 0,
                  }}
                  icon={<EditIcon />}
                  onClick={() => {
                    setStep(4);
                  }}
                />
              </Flex>
              <ButtonGroup spacing={0} flexDirection="column">
                <CustomButton
                  icon={<SleepingEmoji />}
                  current={toTime(achievedHours)}
                  goal={hours}
                  unit="Hrs"
                  onClick={() => {
                    setStep(1);
                  }}
                />
                <CustomButton
                  icon={<FireIcon />}
                  current={achievedCalories}
                  goal={calories}
                  unit="Kcal"
                  onClick={() => {
                    setStep(2);
                  }}
                />
                <CustomButton
                  icon={<WalkIcon />}
                  current={achievedTotalSteps}
                  // current={achievedTotalSteps / 1000 + "k"}
                  goal={totalSteps}
                  unit="Steps"
                  onClick={() => {
                    setStep(3);
                  }}
                />
              </ButtonGroup>
            </Flex>
            <Flex
              alt="rightSide"
              alignItems="center"
              justifyContent="center"
              flex={2}
            >
              <CircularProgress
                style={circularProgressStyle}
                value={caloriesPercentage}
                size="113px"
                trackColor="transparent"
                color="#DC3284"
                thickness="10px"
                capIsRound
              />
              <CircularProgress
                style={circularProgressStyle}
                value={hoursPercentage}
                size="88px"
                trackColor="transparent"
                color="#E7D535"
                thickness="13px"
                capIsRound
                marginTop="5px"
              />
              <CircularProgress
                style={circularProgressStyle}
                value={stepsPercentage}
                size="66px"
                trackColor="transparent"
                color="#AE35E7"
                thickness="13px"
                capIsRound
                marginTop="10px"
              />
              <div style={{ marginTop: 33 }}>
                <HealthIcon />
              </div>
            </Flex>
          </Flex>
          <Flex alt="bottomContainer" paddingTop="35px" flexDirection="column">
            <Text color="white" fontSize="12px" fontWeight="700">
              7 day averages
            </Text>
            <Flex paddingTop="16px" justifyContent="space-between">
              <Card
                icon={<SleepingEmoji size="15px" />}
                title={weeklyAvgHours}
                subtitle="Sleep per night"
              />
              <Card
                icon={<FireIcon size="15px" />}
                title={weeklyAvgCalories}
                subtitle="Burnt per day"
              />
              <Card
                icon={<WalkIcon size="15px" />}
                title={weeklyAvgSteps}
                subtitle="Walked per day"
              />
            </Flex>
          </Flex>
        </Flex>
      )}
      {step === 1 && (
        <Flex alt="container" style={containerStyle} flex={1}>
          <Text fontSize="16px" color="#3271E6" fontWeight="bold">
            Holistic Health
          </Text>
          <Flex alt="uppperContaner">
            <Flex alt="leftSide" flexDirection="column" flex={2}>
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="12px" color="#F6F6F6" fontWeight="bold">
                  Daily Goals
                </Text>
                <IconButton
                  style={{
                    border: 0,
                  }}
                  icon={<EditIcon />}
                  onClick={() => {
                    setStep(4);
                  }}
                />
              </Flex>
              <ButtonGroup spacing={0} flexDirection="column">
                <CustomButton
                  icon={<SleepingEmoji />}
                  current={toTime(achievedHours)}
                  goal={hours}
                  unit="Hrs"
                  onClick={() => {
                    setStep(1);
                  }}
                />
                <CustomButton
                  icon={<FireIcon />}
                  current={achievedCalories}
                  goal={calories}
                  unit="Kcal"
                  onClick={() => {
                    setStep(2);
                  }}
                />
                <CustomButton
                  icon={<WalkIcon />}
                  current={achievedTotalSteps}
                  goal={totalSteps}
                  unit="Steps"
                  onClick={() => {
                    setStep(3);
                  }}
                />
              </ButtonGroup>
            </Flex>
            <Flex
              alt="rightSide"
              alignItems="center"
              justifyContent="center"
              flex={2}
            >
              <CircularProgress
                style={circularProgressStyle}
                value={caloriesPercentage}
                size="113px"
                trackColor="transparent"
                color="#DC3284"
                thickness="10px"
                capIsRound
              />
              <CircularProgress
                style={circularProgressStyle}
                value={hoursPercentage}
                size="88px"
                trackColor="transparent"
                color="#E7D535"
                thickness="13px"
                capIsRound
                marginTop="5px"
              />
              <CircularProgress
                style={circularProgressStyle}
                value={stepsPercentage}
                size="66px"
                trackColor="transparent"
                color="#AE35E7"
                thickness="13px"
                capIsRound
                marginTop="10px"
              />
              <div style={{ marginTop: 33 }}>
                <SleepingEmoji />
              </div>
            </Flex>
          </Flex>
          <Flex
            alt="bottomContainer"
            paddingTop="35px"
            flexDirection="row"
            paddingRight="16px"
          >
            <BarChart
              width={350}
              height={103}
              data={ouraSleep}
              margin={{
                top: 0,
                right: 25,
                left: -25,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="0.1 3" />
              <XAxis
                dataKey="summary_date"
                fontSize={10}
                color="white"
                fontWeight="400"
              />
              <YAxis fontSize={10} />
              <Tooltip
                contentStyle={{ background: "lightgray", fontSize: 10 }}
              />
              <Bar
                dataKey="light"
                barSize={18.5}
                stackId="a"
                fill="#FDDF96"
                name="Light"
              />
              <Bar dataKey="rem" stackId="a" fill="#FDB400" name="REM" />
              <Bar dataKey="deep" stackId="a" fill="#624600" name="Deep" />
              <Bar dataKey="awake" stackId="a" fill="#FDF3DB" name="Awake" />
              <Legend
                layout="vertical"
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize="6px"
                width={80}
                wrapperStyle={legendStyle}
              />
            </BarChart>
          </Flex>
        </Flex>
      )}
      {step === 2 && (
        <Flex alt="container" style={containerStyle} flex={1}>
          <Text fontSize="16px" color="#3271E6" fontWeight="bold">
            Holistic Health
          </Text>
          <Flex alt="uppperContaner">
            <Flex alt="leftSide" flexDirection="column" flex={2}>
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="12px" color="#F6F6F6" fontWeight="bold">
                  Daily Goals
                </Text>
                <IconButton
                  style={{
                    border: 0,
                  }}
                  icon={<EditIcon />}
                  onClick={() => {
                    setStep(4);
                  }}
                />
              </Flex>
              <ButtonGroup spacing={0} flexDirection="column">
                <CustomButton
                  icon={<SleepingEmoji />}
                  current={toTime(achievedHours)}
                  goal={hours}
                  unit="Hrs"
                  onClick={() => {
                    setStep(1);
                  }}
                />
                <CustomButton
                  icon={<FireIcon />}
                  current={achievedCalories}
                  goal={calories}
                  unit="Kcal"
                  onClick={() => {
                    setStep(2);
                  }}
                />
                <CustomButton
                  icon={<WalkIcon />}
                  current={achievedTotalSteps}
                  goal={totalSteps}
                  unit="Steps"
                  onClick={() => {
                    setStep(3);
                  }}
                />
              </ButtonGroup>
            </Flex>
            <Flex
              alt="rightSide"
              alignItems="center"
              justifyContent="center"
              flex={2}
            >
              <CircularProgress
                style={circularProgressStyle}
                value={caloriesPercentage}
                size="113px"
                trackColor="transparent"
                color="#DC3284"
                thickness="10px"
                capIsRound
              />
              <CircularProgress
                style={circularProgressStyle}
                value={hoursPercentage}
                size="88px"
                trackColor="transparent"
                color="#E7D535"
                thickness="13px"
                capIsRound
                marginTop="5px"
              />
              <CircularProgress
                style={circularProgressStyle}
                value={stepsPercentage}
                size="66px"
                trackColor="transparent"
                color="#AE35E7"
                thickness="13px"
                capIsRound
                marginTop="10px"
              />
              <div style={{ marginTop: 33 }}>
                <FireIcon />
              </div>
            </Flex>
          </Flex>
          <Flex
            alt="bottomContainer"
            paddingTop="35px"
            flexDirection="row"
            paddingRight="16px"
          >
            <BarChart
              width={292}
              height={103}
              data={ouraActivity}
              margin={{
                top: 7,
                right: 5,
                left: -23,
                bottom: -15,
              }}
            >
              <CartesianGrid strokeDasharray="0.1 3" />
              <XAxis
                dataKey="summary_date"
                fontSize={10}
                color="white"
                fontWeight="400"
              />
              <YAxis fontSize={10} />
              <Tooltip
                contentStyle={{ background: "lightgray", fontSize: 10 }}
              />
              <defs>
                <linearGradient
                  id="colorUv"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="100%"
                  spreadMethod="reflect"
                >
                  <stop offset="0" stopColor="#DC3284" />
                  <stop offset="1" stopColor="#E10C73" />
                </linearGradient>
              </defs>
              <Bar
                dataKey="cal_total"
                barSize={22}
                stackId="a"
                fill="url(#colorUv)"
                name="Calories"
              />
            </BarChart>
          </Flex>
        </Flex>
      )}
      {step === 3 && (
        <Flex alt="container" style={containerStyle} flex={1}>
          <Text fontSize="16px" color="#3271E6" fontWeight="bold">
            Holistic Health
          </Text>
          <Flex alt="uppperContaner">
            <Flex alt="leftSide" flexDirection="column" flex={2}>
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="12px" color="#F6F6F6" fontWeight="bold">
                  Daily Goals
                </Text>
                <IconButton
                  style={{
                    border: 0,
                  }}
                  icon={<EditIcon />}
                  onClick={() => {
                    setStep(4);
                  }}
                />
              </Flex>
              <ButtonGroup spacing={0} flexDirection="column">
                <CustomButton
                  icon={<SleepingEmoji />}
                  current={toTime(achievedHours)}
                  goal={hours}
                  unit="Hrs"
                  onClick={() => {
                    setStep(1);
                  }}
                />
                <CustomButton
                  icon={<FireIcon />}
                  current={achievedCalories}
                  goal={calories}
                  unit="Kcal"
                  onClick={() => {
                    setStep(2);
                  }}
                />
                <CustomButton
                  icon={<WalkIcon />}
                  current={achievedTotalSteps}
                  goal={totalSteps}
                  unit="Steps"
                  onClick={() => {
                    setStep(3);
                  }}
                />
              </ButtonGroup>
            </Flex>
            <Flex
              alt="rightSide"
              alignItems="center"
              justifyContent="center"
              flex={2}
            >
              <CircularProgress
                style={circularProgressStyle}
                value={caloriesPercentage}
                size="113px"
                trackColor="transparent"
                color="#DC3284"
                thickness="10px"
                capIsRound
              />
              <CircularProgress
                style={circularProgressStyle}
                value={hoursPercentage}
                size="88px"
                trackColor="transparent"
                color="#E7D535"
                thickness="13px"
                capIsRound
                marginTop="5px"
              />
              <CircularProgress
                style={circularProgressStyle}
                value={stepsPercentage}
                size="66px"
                trackColor="transparent"
                color="#AE35E7"
                thickness="13px"
                capIsRound
                marginTop="10px"
              />
              <div style={{ marginTop: 33 }}>
                <WalkIcon />
              </div>
            </Flex>
          </Flex>
          <Flex
            alt="bottomContainer"
            paddingTop="35px"
            flexDirection="row"
            paddingRight="16px"
          >
            <BarChart
              width={292}
              height={103}
              data={ouraActivity}
              margin={{
                top: 7,
                right: 5,
                left: -23,
                bottom: -15,
              }}
            >
              <CartesianGrid strokeDasharray="0.1 3" />
              <XAxis
                dataKey="summary_date"
                fontSize={10}
                color="white"
                fontWeight="400"
              />
              <YAxis fontSize={10} />
              <Tooltip
                contentStyle={{ background: "lightgray", fontSize: 10 }}
              />
              <defs>
                <linearGradient
                  id="colorUv"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="100%"
                  spreadMethod="reflect"
                >
                  <stop offset="0" stopColor="#AE35E7" />
                  <stop offset="1" stopColor="#831AD6" />
                </linearGradient>
              </defs>
              <Bar
                dataKey="steps"
                barSize={22}
                stackId="a"
                fill="url(#colorUv)"
                name="Steps"
              />
            </BarChart>
          </Flex>
        </Flex>
      )}
      {step === 4 && (
        <Flex alt="container" style={containerStyle} flex={1}>
          <Text fontSize="16px" color="#3271E6" fontWeight="bold">
            Holistic Health
          </Text>
          <Flex alt="uppperContaner">
            <Flex
              alt="leftSide"
              flexDirection="column"
              flex={2}
              width="147px"
              height="131px"
              borderWidth="1px"
              borderColor="#6E587A"
              borderRadius="5px"
              paddingBottom="10px"
              paddingLeft="10px"
              paddingRight="10px"
              justifyContent="space-between"
            >
              <Flex
                alt="toolbar"
                justifyContent="space-between"
                alignItems="center"
              >
                <Text fontSize="12px" color="#F6F6F6" fontWeight="bold">
                  Edit Goals
                </Text>
                <Flex>
                  <IconButton
                    style={{
                      border: 0,
                    }}
                    icon={<CloseIcon />}
                    paddingRight="12px"
                    onClick={() => {
                      setStep(0);
                    }}
                  />
                  <IconButton
                    style={{
                      border: 0,
                    }}
                    icon={<CheckIcon />}
                    onClick={() => {
                      setStep(0);
                    }}
                  />
                </Flex>
              </Flex>
              <Stack spacing={5}>
                <Flex alt="input1" alignItems="baseline">
                  <Input
                    width="26px"
                    height="24px"
                    color="white "
                    bg="#39114F"
                    borderWidth="0px"
                    borderRadius="2px"
                    onChange={(e) => {
                      setHours(e.currentTarget.value);
                    }}
                  />
                  <Text paddingLeft="6px" color="#F6F6F6" fontSize="10px">
                    hrs per night
                  </Text>
                </Flex>
                <Flex alt="input2" alignItems="baseline">
                  <Input
                    width="77px"
                    height="24px"
                    color="white "
                    bg="#39114F"
                    borderWidth="0px"
                    borderRadius="2px"
                    onChange={(e) => {
                      setCalories(e.currentTarget.value);
                    }}
                  />
                  <Text paddingLeft="6px" color="#F6F6F6" fontSize="10px">
                    Kcal
                  </Text>
                </Flex>
                <Flex alt="input3" alignItems="baseline">
                  <Input
                    width="77px"
                    height="24px"
                    color="white "
                    bg="#39114F"
                    borderWidth="0px"
                    borderRadius="2px"
                    onChange={(e) => {
                      setTotalSteps(e.currentTarget.value);
                    }}
                  />
                  <Text paddingLeft="6px" color="#F6F6F6" fontSize="10px">
                    Steps
                  </Text>
                </Flex>
              </Stack>
            </Flex>
            <Flex
              alt="rightSide"
              alignItems="center"
              justifyContent="center"
              flex={2}
            >
              <CircularProgress
                style={circularProgressStyle}
                value={caloriesPercentage}
                size="113px"
                trackColor="transparent"
                color="#DC3284"
                thickness="10px"
                capIsRound
              />
              <CircularProgress
                style={circularProgressStyle}
                value={hoursPercentage}
                size="88px"
                trackColor="transparent"
                color="#E7D535"
                thickness="13px"
                capIsRound
                marginTop="5px"
              />
              <CircularProgress
                style={circularProgressStyle}
                value={stepsPercentage}
                size="66px"
                trackColor="transparent"
                color="#AE35E7"
                thickness="13px"
                capIsRound
                marginTop="10px"
              />
              <div style={{ marginTop: 33 }}>
                <HealthIcon />
              </div>
            </Flex>
          </Flex>
          <Flex alt="bottomContainer" paddingTop="16px" flexDirection="column">
            <Text color="white" fontSize="12px" fontWeight="700">
              7 day averages
            </Text>
            <Flex paddingTop="16px" justifyContent="space-between">
              <Card
                icon={<SleepingEmoji size="15px" />}
                title={weeklyAvgHours}
                subtitle="Sleep per night"
              />
              <Card
                icon={<FireIcon size="15px" />}
                title={weeklyAvgCalories}
                subtitle="Burnt per day"
              />
              <Card
                icon={<WalkIcon size="15px" />}
                title={weeklyAvgSteps}
                subtitle="Walked per day"
              />
            </Flex>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default HolisticHealth;
