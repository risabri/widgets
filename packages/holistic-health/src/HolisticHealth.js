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

const HolisticHealth = () => {
  const { onUpdate, Prifina, API, registerHooks } = usePrifina();

  const prifina = new Prifina({ appId: appID });

  const [ouraActivity, setOuraActivity] = useState();
  const [ouraSleep, setOuraSleep] = useState();
  const [lastObject, setLastObject] = useState();

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

    //create 7 days of data from one day data model
    const makeRepeated = (arr, repeats) =>
      Array.from({ length: repeats }, () => arr).flat();

    let newArray = makeRepeated([data], 7);
    //console.log("new", newArray);
    setOuraActivity(newArray);

    let totalSteps = newArray.map((a) => a.steps);
    let totalCalories = newArray.map((a) => a.cal_total);

    const sum = totalSteps.reduce((a, b) => a + b, 0);

    setLastObject(newArray[6]);
    setAchievedCalories(newArray[6].cal_total);
    setAchievedTotalSteps(newArray[6].steps);

    const weekTotalCalories = newArray.map((a) => a.cal_total);
    const weekTotalSteps = newArray.map((a) => a.steps);

    const caloriesSum = weekTotalCalories.reduce((a, b) => a + b, 0);
    const caloriesAvg = Math.round(caloriesSum / weekTotalCalories.length || 0);

    const stepsSum = weekTotalSteps.reduce((a, b) => a + b, 0);
    const stepsAvg = Math.round(stepsSum / weekTotalSteps.length || 0);

    setWeeklyAvgCalories(caloriesAvg);
    setWeeklyAvgSteps(stepsAvg);
  };

  const processSleepData = (data) => {
    //create 7 days of data from one day data model
    const makeRepeated = (arr, repeats) =>
      Array.from({ length: repeats }, () => arr).flat();

    let newArray = makeRepeated([data], 7);
    //console.log("7daysleepdata", newArray);

    let sleep = newArray.map((a) => a.total);

    const sleepSum = sleep.reduce((a, b) => a + b, 0);
    const sleepAvg = sleepSum / sleep.length || 0;

    const weeklyAvgHours = toTime(sleepAvg);

    setWeeklyAvgHours(weeklyAvgHours);

    setAchievedHours(newArray[6].total);

    setOuraSleep(newArray);
  };

  const dataUpdate = async (data) => {
    // should check the data payload... :)
    console.log("DATA UPDATE ", data);

    if (
      data.hasOwnProperty("settings") &&
      typeof data.settings === "object" &&
      data.settings.year !== ""
    ) {
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
            [Op.eq]: { fn: "YEAR", field: "summary_date", opts: null },
          },
          [month]: {
            [Op.eq]: { fn: "MONTH", field: "summary_date", opts: null },
          },
        },
      };

      const activityResult = await API[appID].Oura.queryActivitySummariesAsync({
        filter: filter,
      });

      const sleepResult = await API[appID].Oura.querySleepSummariesAsync({
        filter: filter,
      });

      //needs to be handled in if loop doesn't work
      // if (activityResult.data.getDataObject.content.length > 0) {
      //   processActivityData(activityResult.data.getDataObject.content.activity);
      // }
      processSleepData(sleepResult.data.getDataObject.content);
      processActivityData(activityResult.data.getDataObject.content.activity);
    }
  };

  useEffect(async () => {
    // init callback function for background updates/notifications
    onUpdate(appID, dataUpdate);
    // register datasource modules
    registerHooks(appID, [Oura]);

    const d = new Date();
    const currentMonth = d.getMonth();
    d.setMonth(d.getMonth() - 1);
    while (d.getMonth() === currentMonth) {
      d.setDate(d.getDate() - 1);
    }
    let year = d.getFullYear();
    let month = d.getMonth();

    // if (
    //   data.hasOwnProperty("settings") &&
    //   data.settings.hasOwnProperty("year") &&
    //   data.settings.year !== ""
    // ) {
    //   year = parseInt(data.settings.year);
    //   month = parseInt(data.settings.month);
    // }

    const filter = {
      [Op.and]: {
        [year]: {
          [Op.eq]: { fn: "YEAR", field: "summary_date", opts: null },
        },
        [month]: {
          [Op.eq]: { fn: "MONTH", field: "summary_date", opts: null },
        },
      },
    };

    // console.log("FILTER", filter);

    const activityResult = await API[appID].Oura.queryActivitySummariesAsync({
      filter: filter,
    });

    const sleepResult = await API[appID].Oura.querySleepSummariesAsync({
      filter: filter,
    });

    //needs to be handled in if loop doesn't work
    // if (activityResult.data.getDataObject.content.length > 0) {
    //   processActivityData(activityResult.data.getDataObject.content.activity);
    // }
    processSleepData(sleepResult.data.getDataObject.content);
    processActivityData(activityResult.data.getDataObject.content.activity);
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

  ///CircleProgressBar precentage values
  const hoursPrecentage = (achievedHours / hrsToSeconds) * 100;
  const caloriesPrecentage = (achievedCalories / calories) * 100;
  const stepsPrecentage = (achievedTotalSteps / totalSteps) * 100;

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
                value={caloriesPrecentage}
                size="113px"
                trackColor="transparent"
                color="#DC3284"
                thickness="10px"
                capIsRound
              />
              <CircularProgress
                style={circularProgressStyle}
                value={hoursPrecentage}
                size="88px"
                trackColor="transparent"
                color="#E7D535"
                thickness="13px"
                capIsRound
                marginTop="5px"
              />
              <CircularProgress
                style={circularProgressStyle}
                value={stepsPrecentage}
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
                value={caloriesPrecentage}
                size="113px"
                trackColor="transparent"
                color="#DC3284"
                thickness="10px"
                capIsRound
              />
              <CircularProgress
                style={circularProgressStyle}
                value={hoursPrecentage}
                size="88px"
                trackColor="transparent"
                color="#E7D535"
                thickness="13px"
                capIsRound
                marginTop="5px"
              />
              <CircularProgress
                style={circularProgressStyle}
                value={stepsPrecentage}
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
                value={caloriesPrecentage}
                size="113px"
                trackColor="transparent"
                color="#DC3284"
                thickness="10px"
                capIsRound
              />
              <CircularProgress
                style={circularProgressStyle}
                value={hoursPrecentage}
                size="88px"
                trackColor="transparent"
                color="#E7D535"
                thickness="13px"
                capIsRound
                marginTop="5px"
              />
              <CircularProgress
                style={circularProgressStyle}
                value={stepsPrecentage}
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
                value={caloriesPrecentage}
                size="113px"
                trackColor="transparent"
                color="#DC3284"
                thickness="10px"
                capIsRound
              />
              <CircularProgress
                style={circularProgressStyle}
                value={hoursPrecentage}
                size="88px"
                trackColor="transparent"
                color="#E7D535"
                thickness="13px"
                capIsRound
                marginTop="5px"
              />
              <CircularProgress
                style={circularProgressStyle}
                value={stepsPrecentage}
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
                value={caloriesPrecentage}
                size="113px"
                trackColor="transparent"
                color="#DC3284"
                thickness="10px"
                capIsRound
              />
              <CircularProgress
                style={circularProgressStyle}
                value={hoursPrecentage}
                size="88px"
                trackColor="transparent"
                color="#E7D535"
                thickness="13px"
                capIsRound
                marginTop="5px"
              />
              <CircularProgress
                style={circularProgressStyle}
                value={stepsPrecentage}
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
