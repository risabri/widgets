import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { usePrifina, Op } from "@prifina/hooks";
import Fitbit from "@prifina/fitbit";
import Oura from "@prifina/oura";
import Garmin from "@prifina/garmin";

const Container = styled.div`
  height: 300px;
  font-size: 14px;
  width: 300px;
  padding: 5px;
  /*
  display: flex;
  justify-content: center;
  align-items: center;
  */
`;

// unique appID for the widget....
const appID = "866fscSq5Ae7bPgUtb6ffB";

const UseFetch = (initialUrl) => {
  // create state variables
  const [s3Data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [url, setUrl] = useState(initialUrl);

  useEffect(() => {
    if (!url) return;
    setIsLoading(true);
    // clear old search
    setData(null);
    setError(null);

    fetch(url)
      .then((response) => {
        //console.log("RES ", response);
        return response.text();
      })
      .then((data) => {
        // error handling for nonexistent data
        //console.log("FETCH DATA ", data);
        setIsLoading(false);
        if (data.code >= 400) {
          setError(data.message);
          return;
        }

        setData(data);
      })
      .catch((error) => {
        setIsLoading(false);
        setError(error);
      });
  }, [url]);

  return { s3Data, error, isLoading, setUrl };
};

const DataTest = (props) => {
  const { data } = props;
  // init hook and get provider api services...
  const { onUpdate, Prifina, API, registerHooks } = usePrifina();

  // init provider api with your appID
  const prifina = new Prifina({ appId: appID });
  const [functions, setFunctions] = useState([]);
  const [connectorFunction, setConnectorFunction] = useState(
    "Fitbit.queryActivities"
  );
  const [functionCondition, setFunctionCondition] = useState("eq");
  const [conditionValue, setConditionValue] = useState("");

  const { s3Data, error, isLoading, setUrl } = UseFetch(null);

  /*
  getModuleName,
  getInfo,
  queryActivities,
  queryActivitySummary,
  queryHearRataSummary,
  querySleepSummary,
  queryHearRateData,
  querySleepData,
  */
  const dataUpdate = async (data) => {
    // should check the data payload... :)
    console.log("FITBIT UPDATE ", new Date().getTime(), data);
    //console.log(" UPDATE ", data.hasOwnProperty("settings"));
    //console.log(" UPDATE ", typeof data.settings);
    console.log(" UPDATE ", Object.keys(data));

    if (
      data.data.hasOwnProperty("content") &&
      data.data.content.hasOwnProperty("s3Url")
    ) {
      console.log("GET ", data.data.content.s3Url);
      setUrl(data.data.content.s3Url);
    }
  };

  useEffect(() => {
    console.log("NEW DATA ", isLoading, s3Data);
    if (!isLoading && s3Data) {
      //athenaData = athenaResult.Body.toString().replace(/\"/g, "").split("\n");
      const athenaData = s3Data.replace(/\"/g, "").split("\n");
      console.log(athenaData);
    }
  }, [isLoading, s3Data]);

  useEffect(async () => {
    // init callback function for background updates/notifications
    onUpdate(appID, dataUpdate);
    // register datasource modules
    registerHooks(appID, [Fitbit, Oura, Garmin]);

    //console.log(API[appID]);
    //console.log(API[appID].Fitbit);

    const fitbitFunctions = Object.keys(API[appID].Fitbit).map((s) => {
      return "Fitbit." + s;
    });
    const ouraFunctions = Object.keys(API[appID].Oura).map((s) => {
      return "Oura." + s;
    });
    const garminFunctions = Object.keys(API[appID].Garmin).map((s) => {
      return "Garmin." + s;
    });
    setFunctions(
      functions.concat(fitbitFunctions, ouraFunctions, garminFunctions)
    );

    //Symbol.keyFor(logicalOP) + k;
    //Symbol.keyFor(Op['eq'])
  }, []);

  /*
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
            [Op.eq]: { fn: "YEAR", field: "p_datetime", opts: null },
          },
          [month]: {
            [Op.eq]: { fn: "MONTH", field: "p_datetime", opts: null },
          },
          100: { [Op.eq]: { fn: "CAST", field: "p_confidence", opts: "int" } },
        },
      };

      console.log("FILTER ", filter);

      const result = await API[appID].GoogleTimeline.queryActivities({
        filter: filter,
      });
      console.log("DATA ", result.data.getDataObject.content);
      if (result.data.getDataObject.content.length > 0) {
        processData(result.data.getDataObject.content);
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
          [Op.eq]: { fn: "YEAR", field: "p_datetime", opts: null },
        },
        [month]: {
          [Op.eq]: { fn: "MONTH", field: "p_datetime", opts: null },
        },
        100: { [Op.eq]: { fn: "CAST", field: "p_confidence", opts: "int" } },
      },
    };


    period.current = year + "/" + month;
    //console.log("FILTER ", filter, buildFilter(filter));

    const result = await API[appID].GoogleTimeline.queryActivities({
      filter: filter,
    });
    console.log("DATA ", result.data.getDataObject.content);
    if (result.data.getDataObject.content.length > 0) {
      processData(result.data.getDataObject.content);
    }
  }, []);
  */

  return (
    <Container>
      <div>Testing</div>
      <div>
        <select
          onChange={(event) => setConnectorFunction(event.target.value)}
          defaultValue={connectorFunction}
        >
          {functions.map((m, i) => (
            <option key={"f-" + i} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
      <div>
        <select
          onChange={(event) => setFunctionCondition(event.target.value)}
          defaultValue={functionCondition}
        >
          <option value={"eq"}>{Symbol.keyFor(Op["eq"])}</option>
          <option value={"ne"}>{Symbol.keyFor(Op["ne"])}</option>
          <option value={"gte"}>{Symbol.keyFor(Op["gte"])}</option>
          <option value={"gt"}>{Symbol.keyFor(Op["gt"])}</option>
          <option value={"lte"}>{Symbol.keyFor(Op["lte"])}</option>
          <option value={"lt"}>{Symbol.keyFor(Op["lt"])}</option>
          <option value={"like"}>{Symbol.keyFor(Op["like"])}</option>
          <option value={"in"}>{Symbol.keyFor(Op["in"])}</option>
          <option value={"between"}>{Symbol.keyFor(Op["between"])}</option>
        </select>
      </div>
      <div>
        <input
          type="text"
          onChange={(event) => setConditionValue(event.target.value)}
        />
      </div>
      <div>
        <button
          onClick={async () => {
            const filter = {
              ["s3::date"]: {
                [Op[functionCondition]]: conditionValue,
              },
            };
            console.log("FILTER", filter);
            const query = connectorFunction.split(".");
            console.log(query);
            //console.log("QUERY", API[appID][query[0]][query[1]]);
            const result = await API[appID][query[0]][query[1]]({
              filter,
            });
            console.log("DATA ", new Date().getTime(), result);
            /*

           const result = await API[appID].Fitbit.queryActivitySummary({
            filter,
          });
          console.log("DATA ", new Date().getTime(), result);
          */
          }}
        >
          RUN
        </button>
      </div>
      <div>
        <button
          onClick={async () => {
            /*
            const filter = {
              [Op.and]: {
                [2021]: {
                  [Op.eq]: { fn: "YEAR", field: "s3_partition", opts: null },
                },
                [12]: {
                  [Op.eq]: { fn: "MONTH", field: "s3_partition", opts: null },
                },
                [13]: {
                  [Op.eq]: { fn: "DAY", field: "s3_partition", opts: null },
                },
              },
            };
            */
            const filter = {
              ["s3::date"]: {
                [Op.eq]: "2021-12-13",
              },
            };
            const result = await API[appID].Fitbit.queryActivitySummary({
              filter,
            });
            console.log("DATA ", new Date().getTime(), result);
          }}
        >
          queryActivitySummary
        </button>
      </div>
      <div>Testing</div>
      <div>
        <button
          onClick={() => {
            /*
            const filter = {
              [Op.and]: {
                [2021]: {
                  [Op.eq]: { fn: "YEAR", field: "s3_partition", opts: null },
                },
                [12]: {
                  [Op.eq]: { fn: "MONTH", field: "s3_partition", opts: null },
                },
                [13]: {
                  [Op.gt]: { fn: "DAY", field: "s3_partition", opts: null },
                },
              },
            };
            */
            const filter = {
              ["s3::date"]: {
                [Op.between]: ["2021-12-01", "2021-12-20"],
              },
            };

            API[appID].Fitbit.queryActivitySummariesAsync({ filter }).then(
              (res) => {
                console.log("DATA2 ", new Date().getTime(), res);
              }
            );
          }}
        >
          queryActivitySummaries
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            const filter = {
              ["s3::date"]: {
                [Op.in]: ["2021-12-01", "2021-12-20"],
              },
            };

            API[appID].Fitbit.queryActivitySummariesAsync({ filter }).then(
              (res) => {
                console.log("DATA3 ", new Date().getTime(), res);
              }
            );
          }}
        >
          queryActivitySummaries in filter
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            const filter = {
              ["s3::date"]: {
                [Op.like]: "2021-12-0%",
              },
            };

            API[appID].Fitbit.queryActivitySummariesAsync({ filter }).then(
              (res) => {
                console.log("DATA3 ", new Date().getTime(), res);
              }
            );
          }}
        >
          queryActivitySummaries like filter
        </button>
      </div>
      <div>
        <button
          onClick={async () => {
            /*
            const filter = {
              [Op.and]: {
                [2021]: {
                  [Op.eq]: { fn: "YEAR", field: "p_datetime", opts: null },
                },
                [10]: {
                  [Op.eq]: { fn: "MONTH", field: "p_datetime", opts: null },
                },
                [16]: {
                  [Op.eq]: { fn: "DAY", field: "p_datetime", opts: null },
                },
              },
            };
            */
            const filter = {
              ["s3::date"]: {
                [Op.eq]: "2021-12-13",
              },
            };
            console.log(API[appID]);

            const result = await API[appID].Oura.queryActivitySummary({
              filter,
            });
            console.log("DATA ", new Date().getTime(), result);
          }}
        >
          queryOuraActivitySummary
        </button>
      </div>
    </Container>
  );
};
DataTest.displayName = "DataTest";

export default DataTest;
