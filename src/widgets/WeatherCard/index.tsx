import React from 'react';
import { Card } from '../../shared/ui/Card';

interface WeatherCardProps {
  data: {
    city_name: string;
    country_code: string | null;
    temperature: number;
    apparent_temperature: number;
    humidity: number;
    wind_speed: number;
    wind_direction: number;
    precipitation: number;
    snowfall: number;
    cloud_cover: number;
    pressure: number;
    weather_description: string;
    weather_code: number;
    is_day: number;
    fetched_at: string;
  };
}

const getWeatherIcon = (code: number, isDay: number): string => {
  // WMO Weather interpretation codes (WW)
  // https://open-meteo.com/en/docs
  const isDaytime = isDay === 1;
  
  if (code === 0) return isDaytime ? '☀️' : '🌙';
  if (code === 1 || code === 2) return isDaytime ? '⛅' : '☁️';
  if (code === 3) return '☁️';
  if (code === 45 || code === 48) return '🌫️';
  if (code === 51 || code === 53 || code === 55) return '🌧️';
  if (code === 56 || code === 57) return '🌧️❄️';
  if (code === 61 || code === 63 || code === 65) return '🌧️';
  if (code === 66 || code === 67) return '🌧️❄️';
  if (code === 71 || code === 73 || code === 75) return '❄️';
  if (code === 77) return '❄️';
  if (code === 80 || code === 81 || code === 82) return '🌧️';
  if (code === 85 || code === 86) return '❄️';
  if (code === 95) return '⛈️';
  if (code === 96 || code === 99) return '⛈️';
  return isDaytime ? '☀️' : '🌙';
};

const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

export const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
  const weatherIcon = getWeatherIcon(data.weather_code, data.is_day);
  const windDir = getWindDirection(data.wind_direction);
  const fetchedTime = new Date(data.fetched_at).toLocaleTimeString();

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {data.city_name}
            {data.country_code && <span className="text-gray-500 ml-2">({data.country_code})</span>}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Updated at {fetchedTime}
          </p>
        </div>
        <div className="text-6xl">{weatherIcon}</div>
      </div>

      {/* Main Temperature */}
      <div className="text-center mb-8">
        <div className="text-7xl font-bold text-gray-800 dark:text-white">
          {Math.round(data.temperature)}°C
        </div>
        <div className="text-gray-500 dark:text-gray-400 mt-2">
          Feels like {Math.round(data.apparent_temperature)}°C
        </div>
        <div className="text-lg text-gray-600 dark:text-gray-300 mt-1">
          {data.weather_description}
        </div>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-blue-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl mb-1">💧</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Humidity</div>
          <div className="text-lg font-semibold">{data.humidity}%</div>
        </div>

        <div className="text-center p-3 bg-blue-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl mb-1">💨</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Wind</div>
          <div className="text-lg font-semibold">
            {Math.round(data.wind_speed)} km/h
          </div>
          <div className="text-xs text-gray-500">{windDir}</div>
        </div>

        <div className="text-center p-3 bg-blue-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl mb-1">🌧️</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Precipitation</div>
          <div className="text-lg font-semibold">{data.precipitation} mm</div>
          {data.snowfall > 0 && (
            <div className="text-xs text-blue-500">Snow: {data.snowfall} mm</div>
          )}
        </div>

        <div className="text-center p-3 bg-blue-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl mb-1">☁️</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Cloud Cover</div>
          <div className="text-lg font-semibold">{data.cloud_cover}%</div>
        </div>

        <div className="text-center p-3 bg-blue-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl mb-1">📊</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Pressure</div>
          <div className="text-lg font-semibold">{data.pressure} hPa</div>
        </div>

        <div className="text-center p-3 bg-blue-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl mb-1">🌡️</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Apparent Temp</div>
          <div className="text-lg font-semibold">
            {Math.round(data.apparent_temperature)}°C
          </div>
        </div>
      </div>
    </Card>
  );
};
