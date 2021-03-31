import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { usePrifina } from "@prifina/hooks";
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
const appID = "timelineWidget";

const TimeLine = (props) => {
  // init hook and get provider api services...
  const { onUpdate, Prifina, API, registerHooks } = usePrifina();

  // init provider api with your appID
  const prifina = new Prifina({ appId: appID });

  const [timelineData, setTimeLineData] = useState({});

  const dataUpdate = (data) => {
    // should check the data payload... :)
    /*
    console.log("UPDATE ", data.data.queryActivities.data);
    let activities = {};
    for (let i = 0; i < data.data.queryActivities.data.length; i++) {
      const a = data.data.queryActivities.data[i];
      if (!activities.hasOwnProperty(a.type)) {
        activities[a.type] = 0;
      }
      activities[a.type] += a.cnt;
    }
    const sortedKeys = Object.keys(activities).sort((a, b) =>
      activities[a] > activities[b] ? 1 : activities[b] > activities[a] ? -1 : 0
    );
    console.log(sortedKeys);
    let sorted = {};
    for (let i = sortedKeys.length - 1; i > sortedKeys.length - 6; i--) {
      //console.log(sortedKeys[i]);
      sorted[sortedKeys[i]] = activities[sortedKeys[i]];
    }
    //console.log(sorted);
    setTimeLineData(sorted);
    */
  };

  useEffect(async () => {
    // init callback function for background updates/notifications
    onUpdate(appID, dataUpdate);
    // register datasource modules
    registerHooks(appID, [GoogleTimeline]);
    // get
    const data = await API[appID].GoogleTimeline.queryActivities({});
    console.log("DATA ", data);
    /*
    await API[appID].GoogleTimeline.queryActivities({
      fields: ["datetimex", "type", "confidence"],
    })
    */
  }, []);

  return (
    <Container>
      <div>
        <div>TOP 5 activities</div>
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
