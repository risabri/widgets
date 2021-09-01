import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { usePrifina } from "@prifina/hooks";

import OuraData from "prifina/oura/";

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

import {
  SleepingEmoji,
  FireIcon,
  WalkIcon,
  HealthIcon,
  EditIcon,
  CloseIcon,
  CheckIcon,
} from "./assets/icons";

import { data } from "./data";

const containerStyle = {
  width: "308px",
  height: "296px",
  background: "#29043B",
  borderRadius: "10px",
  boxShadow: "0px 2px 8px rgba(91, 92, 91, 0.2)",
  padding: 7,
  flexDirection: "column",
};

const legendStyle = {
  fontSize: 10,
};

const circularProgressStyle = {
  position: "absolute",
  borderRadius: 10,
  thickness: 10,
  // y: -1,
  transform: "rotate(180deg)",
  // transform: "scaleX(-1)",
  // transform: ["scaleX(-1)", "rotate(45deg)"],
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
      <Flex paddingLeft="9px">
        <Text paddingRight="3px" fontSize="12px" color="white" fontWeight="700">
          {current}
        </Text>
        <Text paddingRight="3px" fontSize="10px" color="white" fontWeight="400">
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

const appID = "holisticHealthWidget";

const HolisticHealth = () => {
  const { onUpdate, Prifina, API, registerHooks } = usePrifina();

  const prifina = new Prifina({ appId: appID });

  const [filteredData, setFilteredData] = useState();

  const processData = (data) => {
    filteredItems = data;
    setFilteredData(filteredItems);
  };

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

      const result = await API[appID].OuraData.queryOuraDaily({});
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
    registerHooks(appID, [OuraData]);
    // get
    console.log("TIMELINE PROPS DATA ", data);

    const result = await API[appID].OuraData.queryOuraDaily({});
    console.log("DATA ", result.data.getS3Object.content);
    if (result.data.getS3Object.content.length > 0) {
      processData(result.data.getS3Object.content);
    }
  }, []);

  console.log("THIS IS", filteredData);

  const [step, setStep] = useState(0);
  const [hours, setHours] = useState("8");
  const [calories, setCalories] = useState("2000");
  const [totalSteps, setTotalSteps] = useState("10000");

  switch (step) {
    case 0:
      break;
    case 1:
      break;
    case 2:
      break;
    case 3:
      break;
    case 3:
      break;
    default:
  }

  return (
    <ChakraProvider>
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
                  icon={<EditIcon />}
                  onClick={() => {
                    setStep(4);
                  }}
                />
              </Flex>
              <ButtonGroup spacing={0} flexDirection="column">
                <CustomButton
                  icon={<SleepingEmoji />}
                  current="6"
                  goal={hours}
                  unit="Hrs"
                  onClick={() => {
                    setStep(1);
                  }}
                />
                <CustomButton
                  icon={<FireIcon />}
                  current="1456"
                  goal={calories}
                  unit="Kcal"
                  onClick={() => {
                    setStep(2);
                  }}
                />
                <CustomButton
                  icon={<WalkIcon />}
                  current="9.5k"
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
                value={60}
                size="113px"
                trackColor="transparent"
                color="#DC3284"
                thickness="12px"
                capIsRound
              />
              <CircularProgress
                style={circularProgressStyle}
                value={70}
                size="88px"
                trackColor="transparent"
                color="#E7D535"
                thickness="14px"
                capIsRound
              />
              <CircularProgress
                style={circularProgressStyle}
                value={80}
                size="66px"
                trackColor="transparent"
                color="#AE35E7"
                thickness="17px"
                capIsRound
              />
              <HealthIcon />
            </Flex>
          </Flex>
          <Flex alt="bottomContainer" paddingTop="20px" flexDirection="column">
            <Text color="white" fontSize="12px" fontWeight="700">
              7 day averages
            </Text>
            <Flex paddingTop="16px" justifyContent="space-between">
              <Card
                icon={<SleepingEmoji size="15px" />}
                title="7.5"
                subtitle="Sleep per night"
              />
              <Card
                icon={<FireIcon size="15px" />}
                title="2100"
                subtitle="Burnt per day"
              />
              <Card
                icon={<WalkIcon size="15px" />}
                title="12,000"
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
                  icon={<EditIcon />}
                  onClick={() => {
                    setStep(4);
                  }}
                />
              </Flex>
              <ButtonGroup spacing={0} flexDirection="column">
                <CustomButton
                  icon={<SleepingEmoji />}
                  current="6"
                  goal={hours}
                  unit="Hrs"
                  onClick={() => {
                    setStep(1);
                  }}
                />
                <CustomButton
                  icon={<FireIcon />}
                  current="1456"
                  goal={calories}
                  unit="Kcal"
                  onClick={() => {
                    setStep(2);
                  }}
                />
                <CustomButton
                  icon={<WalkIcon />}
                  current="9.5k"
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
                value={60}
                size="113px"
                trackColor="transparent"
                color="#450323"
                thickness="12px"
                capIsRound
              />
              <CircularProgress
                style={circularProgressStyle}
                value={70}
                size="88px"
                trackColor="transparent"
                color="#E7D535"
                thickness="14px"
                capIsRound
              />
              <CircularProgress
                style={circularProgressStyle}
                value={80}
                size="66px"
                trackColor="transparent"
                color="#4F145E"
                thickness="18px"
                capIsRound
              />
              <SleepingEmoji />
            </Flex>
          </Flex>
          <Flex
            alt="bottomContainer"
            paddingTop="20px"
            flexDirection="row"
            paddingRight="16px"
          >
            <BarChart
              width={350}
              height={103}
              data={data}
              margin={{
                top: 0,
                right: 25,
                left: -43,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="0.1 3" />
              <XAxis
                dataKey="day"
                fontSize={10}
                color="white"
                fontWeight="400"
              />
              <YAxis fontSize={10} />
              <Tooltip />
              <Bar
                dataKey="lightSleep"
                barSize={18.5}
                stackId="a"
                fill="#FDDF96"
                name="Light"
              />
              <Bar dataKey="remSleep" stackId="a" fill="#FDB400" name="REM" />
              <Bar dataKey="deepSleep" stackId="a" fill="#624600" name="Deep" />
              <Bar
                dataKey="awakeTime"
                stackId="a"
                fill="#FDF3DB"
                name="Awake"
              />
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
                  icon={<EditIcon />}
                  onClick={() => {
                    setStep(4);
                  }}
                />
              </Flex>
              <ButtonGroup spacing={0} flexDirection="column">
                <CustomButton
                  icon={<SleepingEmoji />}
                  current="6"
                  goal={hours}
                  unit="Hrs"
                  onClick={() => {
                    setStep(1);
                  }}
                />
                <CustomButton
                  icon={<FireIcon />}
                  current="1456"
                  goal={calories}
                  unit="Kcal"
                  onClick={() => {
                    setStep(2);
                  }}
                />
                <CustomButton
                  icon={<WalkIcon />}
                  current="9.5k"
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
                value={60}
                size="113px"
                trackColor="transparent"
                color="#DC3284"
                thickness="12px"
                capIsRound
              />
              <CircularProgress
                style={circularProgressStyle}
                value={70}
                size="88px"
                trackColor="transparent"
                color="#3C370F"
                thickness="14px"
                capIsRound
              />
              <CircularProgress
                style={circularProgressStyle}
                value={80}
                size="66px"
                trackColor="transparent"
                color="#4F145E"
                capIsRound
                thickness="17px"
              />
              <FireIcon />
            </Flex>
          </Flex>
          <Flex
            alt="bottomContainer"
            paddingTop="20px"
            flexDirection="row"
            paddingRight="16px"
          >
            <BarChart
              width={292}
              height={103}
              data={data}
              margin={{
                top: 7,
                right: 5,
                left: -23,
                bottom: -15,
              }}
            >
              <CartesianGrid strokeDasharray="0.1 3" />
              <XAxis
                dataKey="day"
                fontSize={10}
                color="white"
                fontWeight="400"
              />
              <YAxis fontSize={10} />
              <Tooltip />
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
                dataKey="calories"
                barSize={22}
                stackId="a"
                fill="url(#colorUv)"
                name="Light"
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
                  icon={<EditIcon />}
                  onClick={() => {
                    setStep(4);
                  }}
                />
              </Flex>
              <ButtonGroup spacing={0} flexDirection="column">
                <CustomButton
                  icon={<SleepingEmoji />}
                  current="6"
                  goal={hours}
                  unit="Hrs"
                  onClick={() => {
                    setStep(1);
                  }}
                />
                <CustomButton
                  icon={<FireIcon />}
                  current="1456"
                  goal={calories}
                  unit="Kcal"
                  onClick={() => {
                    setStep(2);
                  }}
                />
                <CustomButton
                  icon={<WalkIcon />}
                  current="9.5k"
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
                value={60}
                size="113px"
                trackColor="transparent"
                color="#3C0D23"
                thickness="12px"
                capIsRound
              />
              <CircularProgress
                style={circularProgressStyle}
                value={70}
                size="88px"
                trackColor="transparent"
                color="#3C370F"
                thickness="14px"
                capIsRound
              />
              <CircularProgress
                style={circularProgressStyle}
                value={80}
                size="66px"
                trackColor="transparent"
                color="#AE35E7"
                capIsRound
                thickness="17px"
              />
              <WalkIcon />
            </Flex>
          </Flex>
          <Flex
            alt="bottomContainer"
            paddingTop="20px"
            flexDirection="row"
            paddingRight="16px"
          >
            <BarChart
              width={292}
              height={103}
              data={data}
              margin={{
                top: 7,
                right: 5,
                left: -23,
                bottom: -15,
              }}
            >
              <CartesianGrid strokeDasharray="0.1 3" />
              <XAxis
                dataKey="day"
                fontSize={10}
                color="white"
                fontWeight="400"
              />
              <YAxis fontSize={10} />
              <Tooltip />
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
                name="Light"
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
              paddingTop="0px"
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
                    icon={<CloseIcon />}
                    paddingRight="12px"
                    onClick={() => {
                      setStep(0);
                    }}
                  />
                  <IconButton
                    icon={<CheckIcon />}
                    onClick={() => {
                      setStep(0);
                    }}
                  />
                </Flex>
              </Flex>
              <Stack spacing={10}>
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
              paddingBottom="16px"
              paddingRight="7px"
            >
              <CircularProgress
                style={circularProgressStyle}
                value={60}
                size="113px"
                trackColor="transparent"
                color="#DC3284"
                thickness="12px"
                capIsRound
              />
              <CircularProgress
                style={circularProgressStyle}
                value={70}
                size="88px"
                trackColor="transparent"
                color="#E7D535"
                thickness="14px"
                capIsRound
              />
              <CircularProgress
                style={circularProgressStyle}
                value={80}
                size="66px"
                trackColor="transparent"
                color="#AE35E7"
                thickness="17px"
                capIsRound
              />
              <HealthIcon />
            </Flex>
          </Flex>
          <Flex alt="bottomContainer" paddingTop="3px" flexDirection="column">
            <Text color="white" fontSize="12px" fontWeight="700">
              7 day averages
            </Text>
            <Flex paddingTop="16px" justifyContent="space-between">
              <Card
                icon={<SleepingEmoji size="15px" />}
                title="7.5"
                subtitle="Sleep per night"
              />
              <Card
                icon={<FireIcon size="15px" />}
                title="2100"
                subtitle="Burnt per day"
              />
              <Card
                icon={<WalkIcon size="15px" />}
                title="12,000"
                subtitle="Walked per day"
              />
            </Flex>
          </Flex>
        </Flex>
      )}
    </ChakraProvider>
  );
};

export default HolisticHealth;
