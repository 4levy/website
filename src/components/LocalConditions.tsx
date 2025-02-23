"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime: string;
    localtime_epoch: number;
  };
  current: {
    last_updated: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
    gust_mph: number;
    gust_kph: number;
    dewpoint_c: number;
    dewpoint_f: number;
  };
}

export default function LocalConditions() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMetric, setIsMetric] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=auto:ip&aqi=no`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }

        const data = await response.json();
        setWeather(data);
      } catch (err) {
        console.error("Weather fetch error:", err);
        setError("Could not load weather data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 300000);
    return () => clearInterval(interval);
  }, []);

  const getUVLevel = (uv: number) => {
    if (uv <= 2) return { text: "Low", color: "text-green-400" };
    if (uv <= 5) return { text: "Moderate", color: "text-yellow-400" };
    if (uv <= 7) return { text: "High", color: "text-orange-400" };
    return { text: "Very High", color: "text-red-400" };
  };

  if (isLoading) {
    return (
      <div className="glass-card p-6 rounded-lg animate-pulse">
        <div className="h-6 bg-sky-500/20 rounded w-1/3 mb-4" />
        <div className="h-4 bg-sky-500/20 rounded w-2/3 mb-2" />
        <div className="h-4 bg-sky-500/20 rounded w-1/2" />
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="glass-card p-6 rounded-lg">
        <p className="text-ice-blue/70 text-center">
          {error || "No weather data available"}
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-lg">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">
            Local Conditions
          </h3>
          <p className="text-ice-blue/70 text-sm">
            {weather.location.name}, {weather.location.country}
          </p>
          <p className="text-ice-blue/50 text-xs">
            Last updated:{" "}
            {new Date(weather.location.localtime).toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={() => setIsMetric(!isMetric)}
          className="px-3 py-1 text-xs bg-sky-500/20 hover:bg-sky-500/30 
            text-sky-300 rounded-full transition-colors border border-sky-500/20"
        >
          {isMetric ? "°C" : "°F"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div
          className="col-span-2 flex items-center justify-between p-4 
          rounded-lg bg-sky-500/5 border border-sky-500/10"
        >
          <div className="flex items-center gap-4">
            <img
              src={weather.current.condition.icon}
              alt={weather.current.condition.text}
              className="w-12 h-12"
            />
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMetric ? "C" : "F"}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  className="text-2xl font-bold text-white"
                >
                  {isMetric
                    ? `${weather.current.temp_c}°C`
                    : `${weather.current.temp_f}°F`}
                </motion.div>
              </AnimatePresence>
              <p className="text-sm text-ice-blue/70">
                {weather.current.condition.text}
              </p>
            </div>
          </div>
        </div>

        <WeatherStat
          label="Wind"
          value={`${weather.current.wind_kph} km/h ${weather.current.wind_dir}`}
          subValue={`Gusts: ${weather.current.gust_kph} km/h`}
          icon="🌬️"
        />

        <WeatherStat
          label="Humidity"
          value={`${weather.current.humidity}%`}
          subValue={`Dewpoint: ${
            isMetric
              ? `${weather.current.dewpoint_c}°C`
              : `${weather.current.dewpoint_f}°F`
          }`}
          icon="💧"
        />

        <WeatherStat
          label="Pressure"
          value={`${weather.current.pressure_mb} mb`}
          subValue={`${weather.current.pressure_in} in`}
          icon="📊"
        />

        <WeatherStat
          label="Visibility"
          value={`${weather.current.vis_km} km`}
          subValue={`${weather.current.vis_miles} miles`}
          icon="👁️"
        />

        <WeatherStat
          label="UV Index"
          value={getUVLevel(weather.current.uv).text}
          valueClassName={getUVLevel(weather.current.uv).color}
          icon="☀️"
        />

        <WeatherStat
          label="Cloud Cover"
          value={`${weather.current.cloud}%`}
          icon="☁️"
        />
      </div>

      <div className="mt-4 p-3 rounded-lg bg-sky-500/5 border border-sky-500/10">
        <div className="flex items-center gap-2 text-xs text-ice-blue/50">
          <span>
            📍 {weather.location.lat.toFixed(2)}°N,{" "}
            {weather.location.lon.toFixed(2)}°E
          </span>
          <span>|</span>
          <span>🌍 {weather.location.tz_id}</span>
        </div>
      </div>
    </div>
  );
}

function WeatherStat({
  label,
  value,
  subValue,
  icon,
  valueClassName = "text-sky-300",
}: {
  label: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-sky-500/5 border border-sky-500/10">
      <div className="p-2 rounded-full bg-sky-500/10 text-sky-400">{icon}</div>
      <div>
        <p className="text-xs text-ice-blue/50">{label}</p>
        <p className={`text-sm font-medium ${valueClassName}`}>{value}</p>
        {subValue && <p className="text-xs text-ice-blue/40">{subValue}</p>}
      </div>
    </div>
  );
}
