import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { usePrifina, Op } from "@prifina/hooks";
//import Fitbit from "@prifina/fitbit";
//import Oura from "@prifina/oura";
//import Garmin from "@prifina/garmin";
import GoogleTimeline from "@prifina/google-timeline";

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
  return <div>Testing</div>;
};
DataTest.displayName = "DataTest";

export default DataTest;
