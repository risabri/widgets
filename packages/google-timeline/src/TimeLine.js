import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { usePrifina, Op, _fn, buildFilter } from "@prifina/hooks";
import GoogleTimeline from "@prifina/google-timeline/";

const Container = styled.div`
  height: 200px;
  font-size: 14px;
  width: 200px;
  padding: 5px;
  /*
  display: flex;
  justify-content: center;
  align-items: center;
  */
`;

// unique appID for the widget....
const appID = "fNBCsuKbikFG7VahRjRNaX";

const TimeLine = (props) => {
  const { data } = props;
  // init hook and get provider api services...
  const { onUpdate, Prifina, API, registerHooks } = usePrifina();

  // init provider api with your appID
  const prifina = new Prifina({ appId: appID });

  const [timelineData, setTimeLineData] = useState({});
  const period = useRef("");
  const processData = (data) => {
    let activities = {};
    data.forEach((d) => {
      if (parseInt(d.p_confidence) === 100) {
        if (!activities.hasOwnProperty(d.p_type)) {
          activities[d.p_type] = 0;
        }
        activities[d.p_type] += 1;
      }
    });
    const sortedKeys = Object.keys(activities).sort((a, b) =>
      activities[a] > activities[b] ? -1 : activities[b] > activities[a] ? 1 : 0
    );
    //console.log(activities);
    //console.log(sortedKeys);
    let sorted = {};
    for (let i = 0; i < Math.min(5, sortedKeys.length); i++) {
      sorted[sortedKeys[i]] = activities[sortedKeys[i]];
    }

    setTimeLineData(sorted);
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

      const year = parseInt(data.settings.year);
      const month = parseInt(data.settings.month);
      period.current = year + "/" + month;
      const filter = {
        [Op.and]: {
          [year]: {
            [Op.eq]: _fn("YEAR", "p_datetime"),
          },
          [month]: {
            [Op.eq]: _fn("MONTH", "p_datetime"),
          },
          100: { [Op.eq]: _fn("CAST", "p_confidence", "int") },
        },
      };

      console.log("FILTER ", filter);

      const result = await API[appID].GoogleTimeline.queryActivities({
        filter: buildFilter(filter),
      });
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
    registerHooks(appID, [GoogleTimeline]);
    // get
    console.log("TIMELINE PROPS DATA ", data);

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
          [Op.eq]: _fn("YEAR", "p_datetime"),
        },
        [month]: {
          [Op.eq]: _fn("MONTH", "p_datetime"),
        },
        100: { [Op.eq]: _fn("CAST", "p_confidence", "int") },
      },
    };

    period.current = year + "/" + month;
    console.log("FILTER ", filter);

    const result = await API[appID].GoogleTimeline.queryActivities({
      filter: buildFilter(filter),
    });
    console.log("DATA ", result.data.getS3Object.content);
    if (result.data.getS3Object.content.length > 0) {
      processData(result.data.getS3Object.content);
    }
  }, []);

  return (
    <Container>
      <div>
        <div>TOP 5 activities {period.current}</div>
        {Object.keys(timelineData).length > 0 && (
          <ol>
            {Object.keys(timelineData).map((t, k) => {
              return (
                <li key={"act-" + k}>
                  {t}={timelineData[t]}
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </Container>
  );
};
TimeLine.displayName = "TimeLine";

export default TimeLine;
