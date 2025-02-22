"use client";

import { useEffect, useState } from "react";
import { Clock, Calendar } from "./icons";

interface WeatherResponse {
  current: {
    temp_f: number;
    condition: {
      text: string;
    };
    air_quality: {
      "us-epa-index": number;
      pm2_5: number;
    };
  };
}

function getAQILabel(aqi: number) {
  switch (aqi) {
    case 1:
      return { text: "Good", color: "text-green-400" };
    case 2:
      return { text: "Moderate", color: "text-yellow-400" };
    case 3:
      return { text: "Unhealthy for Sensitive", color: "text-orange-400" };
    case 4:
      return { text: "Unhealthy", color: "text-red-400" };
    case 5:
      return { text: "Very Unhealthy", color: "text-purple-400" };
    case 6:
      return { text: "Hazardous", color: "text-rose-600" };
    default:
      return { text: "Unknown", color: "text-gray-400" };
  }
}

export default function LocalConditions() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [location] = useState("Bangkok, Thailand");
  const [weather, setWeather] = useState<{
    temp: number;
    condition: string;
  } | null>(null);
  const [error, setError] = useState(false);
  const [aqi, setAqi] = useState<{ index: number; pm25: number } | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=Bangkok&aqi=yes`
        );

        if (!res.ok) throw new Error("Weather API error");

        const data: WeatherResponse = await res.json();

        if (data?.current) {
          setWeather({
            temp: Math.round(data.current.temp_f),
            condition: data.current.condition.text,
          });
          setAqi({
            index: data.current.air_quality["us-epa-index"],
            pm25: Math.round(data.current.air_quality.pm2_5),
          });
          setError(false);
        }
      } catch (error) {
        console.error("Error fetching weather:", error);
        setError(true);
      }
    };

    fetchWeather();
    const weatherInterval = setInterval(fetchWeather, 600000);

    const updateDateTime = () => {
      const now = new Date();
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Bangkok",
      };
      const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Bangkok",
      };

      setTime(now.toLocaleTimeString("en-US", timeOptions));
      setDate(now.toLocaleDateString("en-US", dateOptions));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => {
      clearInterval(weatherInterval);
      clearInterval(interval);
    };
  }, []);

  const aqiInfo = aqi ? getAQILabel(aqi.index) : null;

  return (
    <div className="glass-card p-4 rounded-lg space-y-3">
      <h3 className="text-lg font-semibold text-white mb-4">
        Local Conditions
      </h3>

      {/* Weather information */}
      <div className="flex items-center gap-3 text-ice-blue/70">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
          />
        </svg>
        <span>
          {error
            ? "Weather unavailable"
            : weather
            ? `${weather.temp}°F • ${weather.condition}`
            : "Loading weather..."}
        </span>
      </div>

      {/* AQI information */}
      {aqi && (
        <div className="flex items-center gap-3 text-ice-blue/70">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            AQI: <span className={aqiInfo?.color}>{aqiInfo?.text}</span> •
            PM2.5: {aqi.pm25}
          </span>
        </div>
      )}

      <div className="flex items-center gap-3 text-ice-blue/70">
        <Clock className="w-4 h-4" />
        <span>{time}</span>
      </div>

      <div className="flex items-center gap-3 text-ice-blue/70">
        <Calendar className="w-4 h-4" />
        <span>{date}</span>
      </div>

      <div className="flex items-center gap-3 text-ice-blue/70">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span>{location}</span>
      </div>
    </div>
  );
}
