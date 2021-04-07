import React, { useState, useEffect } from "react";
import useFetch from "./hooks/useFetch";

import { usePrifina } from "@prifina/hooks";
import { API_KEY, API_BASE_URL } from "./apis/config";

// unique appID for the widget....
const appID = "weatherWidget";

const App = (props) => {
  console.log("WEATHER WIDGET PROPS ", props);

  const { city, data } = props;

  //const city = "san francisco";

  // init hook and get provider api services...
  const { onUpdate, Prifina } = usePrifina();

  // init provider api with your appID
  const prifina = new Prifina({ appId: appID });
  let defaultCity = city;
  if (
    typeof data !== "undefined" &&
    data.hasOwnProperty("settings") &&
    typeof data.settings === "object"
  ) {
    defaultCity = data.settings.city;
  }

  const [searchCity, setCity] = useState(defaultCity);

  const dataUpdate = (data) => {
    // should check the data payload... :)

    if (
      data.hasOwnProperty("settings") &&
      typeof data.settings === "object" &&
      data.settings.hasOwnProperty("city")
    ) {
      //setCity(data.settings.city);
      setUrl(
        `${API_BASE_URL}/data/2.5/weather?q=${data.settings.city}&units=metric&appid=${API_KEY}`
      );
    }
  };

  useEffect(() => {
    // init callback function for background updates/notifications
    onUpdate(appID, dataUpdate);
  }, []);

  const { weatherData, error, isLoading, setUrl } = useFetch(
    `${API_BASE_URL}/data/2.5/weather?q=${searchCity}&units=metric&appid=${API_KEY}`
  );
  //api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

  const getContent = () => {
    if (error) return <h2>Error when fetching: {error}</h2>;
    if (!weatherData && isLoading) return <h2>LOADING...</h2>;
    if (!weatherData) return null;
    console.log(JSON.stringify(weatherData));
    /*
    {"coord":{"lon":24.9355,"lat":60.1695},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds",
    "icon":"03d"}],"base":"stations","main":{"temp":-5.81,"feels_like":-11.21,"temp_min":-6.11,
    "temp_max":-4.44,"pressure":1018,"humidity":86},"visibility":10000,"wind":{"speed":3.6,"deg":150},
    "clouds":{"all":40},"dt":1613732443,"sys":{"type":1,"id":1332,"country":"FI","sunrise":1613713683,
    "sunset":1613748027},"timezone":7200,"id":658225,"name":"Helsinki","cod":200}
    */
    //console.log(weatherData.weather);
    const icon = weatherData.weather[0].icon;
    return (
      <React.Fragment>
        <div
          style={{
            width: "200px",
            height: "200px",
            padding: "5px",
          }}
        >
          <div style={{ textAlign: "center", textTransform: "capitalize" }}>
            {city}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              height: "100px",
            }}
          >
            <img
              width={"100"}
              src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
            />
            <div style={{ width: "90px" }}>
              {Math.ceil(weatherData.main.temp)}
              {"°C"}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "100px",
                textAlign: "center",
                textTransform: "capitalize",
              }}
            >
              {" "}
              {weatherData.weather[0].description}
            </div>
            <div style={{ width: "90px" }} />
          </div>
        </div>
      </React.Fragment>
    );
  };

  return (
    <div>
      {/* 
        <CitySelector onSearch={(city) => setUrl(`${API_BASE_URL}/data/2.5/forecast?q=${city}&cnt=5&appid=${API_KEY}`)} />
  */}
      {/* conditionally render  */}
      {getContent()}
    </div>
  );
};
App.defaultProps = {
  city: "San Francisco",
};
App.displayName = "Weather";

export default App;
