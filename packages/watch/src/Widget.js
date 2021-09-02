import React, { useState, useEffect } from "react";

import { usePrifina } from "@prifina/hooks";

import moment from "moment";
import "moment-timezone";
import { useId } from "@reach/auto-id";

import { Flex, ChakraProvider, Text, Image } from "@chakra-ui/react";

import styled from "styled-components";

import Watch from "./Watch";

const TopContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  //   justify-content: center;
  justify-content: space-between;
  padding-right: 15px;
  padding-left: 15px;
`;

const BottomContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-between;
  padding-right: 10px;
  padding-left: 10px;
`;

const TimeText = styled.div`
  font-size: 30px;
  background: -webkit-linear-gradient(
    180deg,
    #1a1a1a 34.38%,
    #888888 48.96%,
    #1a1a1a 67.19%
  );

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const containerStyle = {
  width: "308px",
  height: "296px",
  borderRadius: "10px",
  background: "linear-gradient(149.48deg, #EBECF0 -13.01%, #E5E6EC 86.1%)",
  boxShadow: "0px 2px 8px rgba(91, 92, 91, 0.2)",
  paddingTop: 7,
  paddingBottom: 26,
  flexDirection: "column",
  justifyContent: "space-between",
};

// const appID = "weatherWidget";

const appID = "clockWidget";

const Widget = (props) => {
  console.log("WATCH PROPS ", props);
  const {
    offset1,
    offset2,
    offset3,
    offset4,
    tz1,
    tz2,
    tz3,
    tz4,
    data,
  } = props;
  // init hook and get provider api services...
  const { onUpdate, Prifina } = usePrifina();

  const [tzInfo, setTzInfo] = useState(tzDefault);
  const [offsetTime, setOffsetTime] = useState();

  // init provider api with your appID
  const prifina = new Prifina({ appId: appID });

  const localTz = moment.tz.guess();

  const localOffset = moment.tz(localTz).utcOffset();
  let tzDefault = {
    offset1: offset1 === -1 ? localOffset : offset1,
    offset2: offset2 === -1 ? localOffset : offset2,

    offset3: offset3 === -1 ? localOffset : offset3,

    offset4: offset4 === -1 ? localOffset : offset4,

    tz1: tz1 === "" ? localTz : tz1,
    tz2: tz2 === "" ? localTz : tz2,
    tz3: tz3 === "" ? localTz : tz3,
    tz4: tz4 === "" ? localTz : tz4,
  };
  if (
    typeof data !== "undefined" &&
    data.hasOwnProperty("settings") &&
    data.settings.hasOwnProperty("tz") &&
    data.settings.tz !== ""
  ) {
    tzDefault = {
      offset: parseInt(data.settings.offset),
      tz: data.settings.tz,
    };
    console.log("NEW DEFAULT, SETTINGS UPDATED ", tzDefault);
  }
  console.log("NEW DEFAULT, SETTINGS UPDATED ", tzDefault.tz1);

  function offsetDate(offset3) {
    var d = new Date(new Date().getTime() + offset3 * 1000);
    var hrs = d.getUTCHours();
    var mins = d.getUTCMinutes();
    var secs = d.getUTCSeconds();
    //simple output
    console.log("SADASASDDAS", hrs + ":" + mins + ":" + secs);
  }

  console.log("SHAHSHSAHASHAS", offsetDate(tzDefault.offset4));

  const dataUpdate = (data) => {
    // should check the data payload... :)
    console.log("WATCH WIDGET UPDATE ", data);

    if (data.hasOwnProperty("settings") && typeof data.settings === "object") {
      //
      setTzInfo({ offset: data.settings.offset, tz: data.settings.tz });
    }
  };

  useEffect(() => {
    // init callback function for background updates/notifications

    onUpdate(appID, dataUpdate);
  }, []);

  /////////TIME PROPS///////////////
  const localTime = moment.tz(localTz).format("dddd, MMMM Do YYYY, h:mm:ss a");
  console.log("LOCAL", localTime);

  const locale = "en";
  const [today, setDate] = useState(new Date()); // Save the current date to be able to trigger an update

  useEffect(() => {
    const timer = setInterval(() => {
      // Creates an interval which will update the current data every minute
      // This will trigger a rerender every component that uses the useDate hook.
      setDate(new Date());
    }, 1000);
    return () => {
      clearInterval(timer); // Return a funtion to clear the timer so that it will stop being called on unmount
    };
  }, []);

  const day = today.toLocaleDateString(locale, { weekday: "long" });
  const date = `${day}, ${today.getDate()} ${today.toLocaleDateString(locale, {
    month: "long",
  })}\n\n`;

  const hour = today.getHours();
  // const wish = `Good ${(hour < 12 && 'Morning') || (hour < 17 && 'Afternoon') || 'Evening'}, `;

  const time = today.toLocaleTimeString(locale, {
    hour: "numeric",
    hour12: true,
    minute: "numeric",
    second: "numeric",
  });

  console.log("TIME", date);

  ////////////////////////////////////////////////////////////////////

  /* <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: 15,
            justifyContent: "center",
          }}
        >
          <text style={{ fontSize: 18, fontWeight: 400 }}>{date}</text>
          <Text className="h1">{time}</Text>
        </div> */

  return (
    <ChakraProvider>
      <Flex style={containerStyle}>
        <Text paddingLeft="8px" fontSize="16px" fontWeight="400">
          Clock Widget
        </Text>
        <TopContainer>
          <Watch offset={offset1} tz={tz1} />
          <Flex flexDirection="column" alignItems="flex-start">
            <Text>{date}</Text>
            <TimeText>{time}</TimeText>
            <Text fontSize="10px">Frankfurt, Germany, +1</Text>
          </Flex>
        </TopContainer>
        <BottomContainer>
          <Watch offset={offset2} tz={tz2} />
          <Watch offset={offset3} tz={tz3} />
          <Watch offset={offset4} tz={tz4} />
        </BottomContainer>
      </Flex>
    </ChakraProvider>
  );
};

export default Widget;
