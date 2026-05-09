import React from 'react';
import { Card } from '../../shared/ui/Card';

interface ForecastDay {
  forecast_date: string;
  temp_max: number;
  temp_min: number;
  precipitation_sum: number;
  snowfall_sum: number;
  wind_speed_max: number;
  wind_gusts_max: number;
  weather_code: number;
  weather_description: string;
  sunrise: string | null;
  sunset: string | null;
  uv_index_max: number | null;
}

interface ForecastListProps {
  data: {
    city_name: string;
    country_code: string | null;
    days: ForecastDay[];
  };
  detailed?: boolean;
}

const getWeatherIcon = (code: number): string => {
  if (code === 0) return '☀️';
  if (code === 1 || code === 2) return '⛅';
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
  return '☀️';
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

export const ForecastList: React.FC<ForecastListProps> = ({ data, detailed = false }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        7-Day Forecast for {data.city_name}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.days.map((day, index) => {
          const date = formatDate(day.forecast_date);
          const icon = getWeatherIcon(day.weather_code);
          const avgTemp = (day.temp_max + day.temp_min) / 2;
          
          return (
            <Card key={index} className="hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  {date}
                </div>
                
                <div className="text-5xl my-3">{icon}</div>
                
                <div className="text-2xl font-bold text-gray-800 dark:text-white">
                  {Math.round(avgTemp)}°C
                </div>
                
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  ↑{Math.round(day.temp_max)}° ↓{Math.round(day.temp_min)}°
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  {day.weather_description}
                </div>
                
                {detailed && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">💧 Rain:</span>
                      <span>{day.precipitation_sum} mm</span>
                    </div>
                    {day.snowfall_sum > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">❄️ Snow:</span>
                        <span>{day.snowfall_sum} mm</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">💨 Wind:</span>
                      <span>{Math.round(day.wind_speed_max)} km/h</span>
                    </div>
                    {day.wind_gusts_max > day.wind_speed_max && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">💨 Gusts:</span>
                        <span>{Math.round(day.wind_gusts_max)} km/h</span>
                      </div>
                    )}
                    {day.uv_index_max && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">☀️ UV Index:</span>
                        <span>{day.uv_index_max}</span>
                      </div>
                    )}
                    {day.sunrise && day.sunset && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">🌅 Sunrise:</span>
                          <span>{new Date(day.sunrise).toLocaleTimeString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">🌇 Sunset:</span>
                          <span>{new Date(day.sunset).toLocaleTimeString()}</span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
