import React, { useEffect, useState } from "react";
import axios from "axios";
import "./index.scss";

const WeatherComponent = () => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    axios
      .get(
        "http://api.weatherstack.com/current?query=Hanoi&access_key=4d26ca0d6363dc32d1135f687109e149"
      )
      .then((response) => {
        const weatherData = response.data;
        setWeather({
          name: weatherData.location.name,
          country: weatherData.location.country,
          temperature: weatherData.current.temperature,
          icon: weatherData.current.weather_icons[0],
        });
      })
      .catch((error) => {
        console.error("Có lỗi xảy ra khi gọi API:", error);
      });
  }, []);
  console.log(weather);

  if (!weather) {
    return <div className="loading mt-2 ml-2">Loading...</div>;
  }

  return (
    <div className="weather">
      <img src={weather.icon} alt="Weather icon" />
      <p className="location m-0 ml-2">
        {weather.name}, {weather.country}
      </p>
      <p className="temperature m-0 ml-2">{weather.temperature}°C</p>
    </div>
  );
};

export default WeatherComponent;
