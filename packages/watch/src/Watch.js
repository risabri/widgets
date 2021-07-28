import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";

import { usePrifina } from "@prifina/hooks";
import moment from "moment";
import "moment-timezone";
import { useId } from "@reach/auto-id";
import { alignItems, alignSelf } from "styled-system";

/*
$primary: black;
$primary-2: white;
$secondary: gray;
$accent: red;
$clock-border: 10px;
*/

const TopContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;
  padding-bottom: 30px;
`;

const BottomContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 15px;
`;

const TzText = styled.div`
  font-size: 12px;
  text-align: center;
  padding: 5px;
`;
const Container = styled.div`
  padding: 10px;
  height: 296px;
  background: linear-gradient(149.48deg, #ebecf0 -13.01%, #e5e6ec 86.1%);
  font-size: 10px;
  width: 308px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 25px;
`;

const testProps = (props) => {
  console.log("PROPS ", props);
  return null;
};
const Clock = styled.div`
  /*background-color: mix(white, gray, 95%); */
  border-radius: 50%;
  // width: ${(props) => props.size};
  // height: ${(props) => props.size};
  width: 92px;
  height: 92px;
  display: flex;
  position: relative;
  // margin-left: 5%;
  // margin-right: 5%;
  // box-shadow: inset 0 0 20px gray;
  border: 7px solid #353935;
  background: black;

  .hours-hand {
    // box-shadow: 1px 1px 1px 1px gray;
    // border-radius: 40% 40% 20% 20%;
    position: absolute;
    // border: 2px solid white;
    background-color: white;
    width: 3px;
  }

  .minutes-hand {
    // box-shadow: 1px 1px 1px 1px gray;
    position: absolute;
    // border-radius: 40% 40% 20% 20%;
    background-color: white;
    // border: 1px solid black;
    width: 2px;
  }

  .seconds-hand {
    // box-shadow: 1px 1px 1px 0px red;
    position: absolute;
    border-radius: 30%;
    background-color: white;
    width: 1px;
  }

  .hand-pivot {
    // box-shadow: 0 0 2px 2px silver;
    border: 3px solid silver;
    border-radius: 50%;
    height: 0px;
    width: 0px;
    position: absolute;
  }

  .dial-hour {
    /*color: mix(white, black, 30%); */
    // text-shadow: 1px 1px 4px;
    position: absolute;
    color: white;
    font-size: 9px;
    padding: 3px;
  }
  .dial-hour.hour-main {
    color: white;
    // font-size: 1.6em;
    font-weight: 500;
  }
`;

const SmallerClock = styled.div`
  /*background-color: mix(white, gray, 95%); */
  border-radius: 50%;
  // width: ${(props) => props.size};
  // height: ${(props) => props.size};
  width: 76px;
  height: 76px;
  display: flex;
  position: relative;
  background: black;

  .hours-hand {
    position: absolute;

    background-color: white;
    width: 3px;
  }

  .minutes-hand {
    position: absolute;

    background-color: white;

    width: 2px;
  }

  .seconds-hand {
    position: absolute;
    border-radius: 30%;
    background-color: white;
    width: 1px;
  }

  .hand-pivot {
    // box-shadow: 0 0 2px 2px silver;
    border: 3px solid silver;
    border-radius: 50%;
    height: 0px;
    width: 0px;
    position: absolute;
  }

  .dial-hour {
    /*color: mix(white, black, 30%); */
    // text-shadow: 1px 1px 4px;
    position: absolute;
    color: white;
    font-size: 8px;
    padding: 3px;
  }
  .dial-hour.hour-main {
    color: white;
    // font-size: 1.6em;
    font-weight: 500;
  }
`;

const Text = styled.div`
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

const Hour = styled.span`
  top: ${(props) => (props.pos ? props.pos.top : 0)}px;
  left: ${(props) => (props.pos ? props.pos.left : 0)}px;
`;
const Pivot = styled.span`
  top: ${(props) => (props.pos ? props.pos.top : 0)}px;
  left: ${(props) => (props.pos ? props.pos.left : 0)}px;
`;
const HoursHand = styled.div`
  position: absolute;
  top: ${(props) => (props.pos ? props.pos.top : 0)}px;
  left: ${(props) => (props.pos ? props.pos.left : 0)}px;
  height: ${(props) => (props.pos ? props.pos.height : 0)}px;
  transform-origin: ${(props) => (props.pos ? props.pos.origin : 0)};
`;
const MinutesHand = styled.div`
  top: ${(props) => (props.pos ? props.pos.top : 0)}px;
  left: ${(props) => (props.pos ? props.pos.left : 0)}px;
  height: ${(props) => (props.pos ? props.pos.height : 0)}px;
  transform-origin: ${(props) => (props.pos ? props.pos.origin : 0)}px;
`;
const SecondsHand = styled.div`
  top: ${(props) => (props.pos ? props.pos.top : 0)}px;
  left: ${(props) => (props.pos ? props.pos.left : 0)}px;
  height: ${(props) => (props.pos ? props.pos.height : 0)}px;
  transform-origin: ${(props) => (props.pos ? props.pos.origin : 0)}px;
`;
const getDims = (elm, removeBorder = true, removePadding = true) => {
  const elmStyles = window.getComputedStyle(elm);
  return {
    height:
      elm.offsetHeight +
      (removeBorder
        ? -parseInt(elmStyles.borderTopWidth, 10) -
          parseInt(elmStyles.borderBottomWidth, 10)
        : 0) +
      (removePadding
        ? -parseInt(elmStyles.paddingTop, 10) -
          parseInt(elmStyles.paddingBottom, 10)
        : 0),
    width:
      elm.offsetWidth +
      (removeBorder
        ? -parseInt(elmStyles.borderLeftWidth, 10) -
          parseInt(elmStyles.borderRightWidth, 10)
        : 0) +
      (removePadding
        ? -parseInt(elmStyles.paddingLeft, 10) -
          parseInt(elmStyles.paddingRight, 10)
        : 0),
  };
};

const clockwiseRotate = (center, angle, point) => {
  const movex = point.x - center.x;
  const movey = point.y - center.y;

  const s = Math.sin((angle * Math.PI) / 180);
  const c = Math.cos((angle * Math.PI) / 180);

  const x = movex * c - movey * s;
  const y = movex * s + movey * c;

  return {
    x: x + center.x,
    y: y + center.y,
  };
};

function useIsMountedRef() {
  const isMountedRef = useRef(null);
  useEffect(() => {
    isMountedRef.current = true;
    return () => (isMountedRef.current = false);
  });
  return isMountedRef;
}

// unique appID for the widget....
const appID = "watchWidget";

const Watch = (props) => {
  console.log("WATCH PROPS ", props);
  const { offset, tz, data } = props;
  // init hook and get provider api services...
  const { onUpdate, Prifina } = usePrifina();

  // init provider api with your appID
  const prifina = new Prifina({ appId: appID });

  const elementId = useId();

  const localTz = moment.tz.guess();

  /////////////////////
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

  const localOffset = moment.tz(localTz).utcOffset();
  let tzDefault = {
    offset: offset === -1 ? localOffset : offset,
    tz: tz === "" ? localTz : tz,
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
  const isMountedRef = useIsMountedRef();
  const [tzInfo, setTzInfo] = useState(tzDefault);
  const [clockSize, setClockSize] = useState("90%");
  const [smallerClockSize, setSmallerClockSize] = useState("50%");
  const [dialHour, setDialHour] = useState([]);
  const [handPivot, setHandPivot] = useState({ top: 0, left: 0 });
  const [hoursHand, setHoursHand] = useState({
    top: 0,
    left: 0,
    height: 0,
    origin: 0,
  });
  const [minutesHand, setMinutesHand] = useState({
    top: 0,
    left: 0,
    height: 0,
    origin: 0,
  });
  const [secondsHand, setSecondsHand] = useState({
    top: 0,
    left: 0,
    height: 0,
    origin: 0,
  });

  useEffect(() => {
    let timeoutId = null;
    let intervalId = null;
    if (isMountedRef.current) {
      const clock = document.getElementById("clock-" + elementId);
      //console.log("MOUNTED ", clock);

      const { height: boxH, width: boxW } = getDims(clock, false, false);
      const minv = Math.min(boxH, boxW);
      //clock.style.height = clock.style.width = minv
      setClockSize(minv + "px");

      const { height, width } = getDims(clock);

      let dialHours = document.getElementsByClassName("dial-hour");
      let offsetFix = dialHours[11].offsetHeight / 10;
      let refx = 0;
      let refy = -height / 2 + dialHours[11].offsetHeight / 2;
      const origin = { x: 0, y: 0 };
      let _dialHours = dialHour;
      for (let i = 1; i <= 12; ++i) {
        let newc = clockwiseRotate(origin, 30, { x: refx, y: refy });
        refx = Math.round(newc.x);
        refy = Math.round(newc.y);
        newc.x = Math.round(
          newc.x - dialHours[i - 1].offsetWidth / 2 + width / 2
        );
        newc.y = Math.round(
          newc.y - dialHours[i - 1].offsetHeight / 2 + height / 2 + offsetFix
        );
        _dialHours.push({ top: newc.y, left: newc.x });
        //dialHours[i - 1].style.top = newc.y + 'px'
        //dialHours[i - 1].style.left = newc.x + 'px'
      }
      //console.log("DIAL ", _dialHours);
      setDialHour(_dialHours);

      const handPivotElement = document.getElementById(
        "hand-pivot-" + elementId
      );
      const pivotBoxDims = getDims(handPivotElement, false, false);
      setHandPivot({
        top: height / 2 - pivotBoxDims.height / 2,
        left: width / 2 - pivotBoxDims.width / 2,
      });

      const hoursHandElement = document.getElementById(
        "hours-hand-" + elementId
      );

      const minutesHandElement = document.getElementById(
        "minutes-hand-" + elementId
      );
      const secondsHandElement = document.getElementById(
        "seconds-hand-" + elementId
      );
      const offByPivot = 0.05 * height;

      const hoursHandDims = getDims(hoursHandElement, false, false);

      const minutesHandDims = getDims(minutesHandElement, false, false);
      const secondsHandDims = getDims(secondsHandElement, false, false);

      const hoursHandHeight = height / 2 - 1.6 * dialHours[11].offsetHeight;
      //height / 2 - 1.6 * dialHours[11].offsetHeight + offByPivot,
      setHoursHand({
        top: 1.6 * dialHours[11].offsetHeight,
        left: width / 2 - hoursHandDims.width / 2,
        height: hoursHandHeight + offByPivot,
        origin: `${hoursHandDims.width / 2}px ${hoursHandHeight}px`,
      });

      const minutesHandHeight = height / 2 - 1.2 * dialHours[11].offsetHeight;
      //height / 2 - 1.2 * dialHours[11].offsetHeight + offByPivot,
      setMinutesHand({
        top: 1.2 * dialHours[11].offsetHeight,
        left: width / 2 - minutesHandDims.width / 2,
        height: minutesHandHeight + offByPivot,
        origin: `${minutesHandDims.width / 2}px ${minutesHandHeight}`,
      });
      const secondsHandHeight = height / 2 - dialHours[11].offsetHeight;
      // height / 2 - dialHours[11].offsetHeight + offByPivot,
      setSecondsHand({
        top: dialHours[11].offsetHeight,
        left: width / 2 - secondsHandDims.width / 2,
        height: secondsHandHeight + offByPivot,
        origin: `${secondsHandDims.width / 2}px ${secondsHandHeight}`,
      });

      let dt = new Date();

      const secsElpased = dt.getSeconds();
      let timezoneMins = dt.getMinutes();
      let timezoneHours = dt.getHours();

      const localOffset = moment.tz(moment.tz.guess()).utcOffset();
      if (tzInfo.offset !== localOffset) {
        const offsetDiff = tzInfo.offset - localOffset;

        const offsetMod = offsetDiff % 60;
        if (offsetMod !== 0) {
          timezoneMins += offsetMod;
        }
        timezoneHours += (offsetDiff - offsetMod) / 60;

        console.log("TZ ", localOffset, offsetDiff, tzInfo.tz, dt);
        console.log("TZ ", timezoneHours, timezoneMins);
      }

      let minsElapsed = timezoneMins + secsElpased / 60;
      let hrsElapsed = (timezoneHours % 12) + minsElapsed / 60;
      /*
      if (tzInfo.offset !== 0) {
        const offsetMod = tzInfo.offset % 60;
        if (offsetMod !== 0) {
          minsElapsed += offsetMod;
        }
       // hrsElapsed += (tzInfo.offset - offsetMod) / 60;

        console.log("TZ ", tzInfo.tz);
      }
*/
      /*
      const offsetMod = tzInfo.offset % 60;
      if (offsetMod !== 0) {
        minsElapsed += offsetMod;
      }
      if (tzInfo.offset !== 0) {
        hrsElapsed += (tzInfo.offset - offsetMod) / 60;
      }
      */
      const rotate = (elm, deg) => {
        elm.style.transform = `rotate(${deg}deg)`;
      };

      let hrsRotn = (hrsElapsed * 360) / 12;
      let minsRotn = (minsElapsed * 360) / 60;
      let secsRotn = (secsElpased * 360) / 60;
      rotate(hoursHandElement, hrsRotn);
      rotate(minutesHandElement, minsRotn);
      rotate(secondsHandElement, secsRotn);

      timeoutId = setTimeout(
        () => (secondsHandElement.style.transition = "transform 1s linear"),
        0
      );
      intervalId = setInterval(() => {
        // do %360
        hrsRotn += 360 / (3600 * 12);
        minsRotn += 360 / (60 * 60);
        secsRotn += 360 / 60;
        rotate(hoursHandElement, hrsRotn);
        rotate(minutesHandElement, minsRotn);
        rotate(secondsHandElement, secsRotn);
      }, 1000);
    }
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [isMountedRef, tzInfo]);

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

  return (
    <Container>
      <div style={{ fontSize: 16 }}>Clock Widget</div>
      <TopContainer>
        <Clock
          id={"clock-" + elementId}
          // size={clockSize}
          width="92px"
          height="72px"
        >
          <HoursHand
            pos={hoursHand}
            className="hours-hand"
            id={"hours-hand-" + elementId}
          ></HoursHand>
          <MinutesHand
            pos={minutesHand}
            className="minutes-hand"
            id={"minutes-hand-" + elementId}
          ></MinutesHand>
          <SecondsHand
            pos={secondsHand}
            className="seconds-hand"
            id={"seconds-hand-" + elementId}
          ></SecondsHand>

          <Pivot
            pos={handPivot}
            className="hand-pivot"
            id={"hand-pivot-" + elementId}
          ></Pivot>
          {[...Array(12)].map((x, i) => {
            if ((i + 1) % 3 === 0) {
              return (
                <Hour
                  pos={dialHour[i]}
                  key={"hour-" + i}
                  className={"dial-hour hour-main"}
                >
                  {i + 1}
                </Hour>
              );
            } else {
              return (
                <Hour
                  pos={dialHour[i]}
                  key={"hour-" + i}
                  className={"dial-hour"}
                >
                  {i + 1}
                </Hour>
              );
            }
          })}
        </Clock>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: 15,
            justifyContent: "center",
          }}
        >
          <text style={{ fontSize: 18, fontWeight: 400 }}>{date}</text>
          <Text className="h1">{time}</Text>
          <text style={{ fontSize: 10 }}>{tzInfo.tz}</text>
        </div>
      </TopContainer>
      {/* <TzText>{tzInfo.tz}</TzText> */}
      <BottomContainer>
        <SmallerClock id={"clock-" + elementId} size={clockSize}>
          <HoursHand
            pos={hoursHand}
            className="hours-hand"
            id={"hours-hand-" + elementId}
          ></HoursHand>

          <MinutesHand
            pos={minutesHand}
            className="minutes-hand"
            id={"minutes-hand-" + elementId}
          ></MinutesHand>
          <SecondsHand
            pos={secondsHand}
            className="seconds-hand"
            id={"seconds-hand-" + elementId}
          ></SecondsHand>
          <Pivot
            pos={handPivot}
            className="hand-pivot"
            id={"hand-pivot-" + elementId}
          ></Pivot>
          {[...Array(12)].map((x, i) => {
            if ((i + 1) % 3 === 0) {
              return (
                <Hour
                  pos={dialHour[i]}
                  key={"hour-" + i}
                  className={"dial-hour hour-main"}
                >
                  {i + 1}
                </Hour>
              );
            } else {
              return (
                <Hour
                  pos={dialHour[i]}
                  key={"hour-" + i}
                  className={"dial-hour"}
                >
                  {i + 1}
                </Hour>
              );
            }
          })}
          <text style={{ paddingTop: 80, paddingLeft: 5 }}>{tzInfo.tz}</text>
        </SmallerClock>

        <SmallerClock id={"clock-" + elementId} size={clockSize}>
          <HoursHand
            pos={hoursHand}
            className="hours-hand"
            id={"hours-hand-" + elementId}
          ></HoursHand>
          <MinutesHand
            pos={minutesHand}
            className="minutes-hand"
            id={"minutes-hand-" + elementId}
          ></MinutesHand>
          <SecondsHand
            pos={secondsHand}
            className="seconds-hand"
            id={"seconds-hand-" + elementId}
          ></SecondsHand>
          <Pivot
            pos={handPivot}
            className="hand-pivot"
            id={"hand-pivot-" + elementId}
          ></Pivot>
          {[...Array(12)].map((x, i) => {
            if ((i + 1) % 3 === 0) {
              return (
                <Hour
                  pos={dialHour[i]}
                  key={"hour-" + i}
                  className={"dial-hour hour-main"}
                >
                  {i + 1}
                </Hour>
              );
            } else {
              return (
                <Hour
                  pos={dialHour[i]}
                  key={"hour-" + i}
                  className={"dial-hour"}
                >
                  {i + 1}
                </Hour>
              );
            }
          })}
          <text style={{ paddingTop: 80, paddingLeft: 5 }}>{tzInfo.tz}</text>
        </SmallerClock>
        <SmallerClock
          id={"clock-" + elementId}
          size={clockSize}
          // style={{ width: 76, height: 76, marginLeft: 0 }}
        >
          <HoursHand
            pos={hoursHand}
            className="hours-hand"
            id={"hours-hand-" + elementId}
          ></HoursHand>
          <MinutesHand
            pos={minutesHand}
            className="minutes-hand"
            id={"minutes-hand-" + elementId}
          ></MinutesHand>
          <SecondsHand
            pos={secondsHand}
            className="seconds-hand"
            id={"seconds-hand-" + elementId}
          ></SecondsHand>
          <Pivot
            pos={handPivot}
            className="hand-pivot"
            id={"hand-pivot-" + elementId}
          ></Pivot>
          {[...Array(12)].map((x, i) => {
            if ((i + 1) % 3 === 0) {
              return (
                <Hour
                  pos={dialHour[i]}
                  key={"hour-" + i}
                  className={"dial-hour hour-main"}
                >
                  {i + 1}
                </Hour>
              );
            } else {
              return (
                <Hour
                  pos={dialHour[i]}
                  key={"hour-" + i}
                  className={"dial-hour"}
                >
                  {i + 1}
                </Hour>
              );
            }
          })}
          <text style={{ paddingTop: 80, paddingLeft: 5 }}>{tzInfo.tz}</text>
        </SmallerClock>
      </BottomContainer>
    </Container>
  );
};

Watch.defaultProps = {
  offset: -1,
  tz: "",
};

Watch.displayName = "Watch";
export default Watch;
