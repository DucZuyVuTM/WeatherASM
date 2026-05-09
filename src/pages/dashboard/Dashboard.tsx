import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import { fetchCurrentWeather, fetchForecast, setSelectedCity } from '../../features/weather/weatherSlice';
import { fetchLocations } from '../../features/locations/locationsSlice';
import { WeatherCard } from '../../widgets/WeatherCard';
import { ForecastList } from '../../widgets/ForecastList';
import { CitySelector } from '../../widgets/CitySelector';
import { WEATHER_CONFIG } from '../../shared/config';

export const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { current, forecast, loading, selectedCity } = useSelector((state: RootState) => state.weather);
  const { locations } = useSelector((state: RootState) => state.locations);
  
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    dispatch(fetchLocations());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCity) {
      dispatch(fetchCurrentWeather(selectedCity));
      dispatch(fetchForecast({ city: selectedCity, days: WEATHER_CONFIG.DEFAULT_FORECAST_DAYS }));
    }
  }, [dispatch, selectedCity]);

  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      if (selectedCity) {
        dispatch(fetchCurrentWeather(selectedCity));
      }
    }, WEATHER_CONFIG.AUTO_REFRESH_INTERVAL);
    
    return () => clearInterval(interval);
  }, [dispatch, selectedCity, autoRefresh]);

  const handleCityChange = (city: string) => {
    dispatch(setSelectedCity(city));
  };

  if (loading && !current) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Weather Dashboard
        </h1>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-600">Auto-refresh (5min)</span>
          </label>
        </div>
      </div>

      <CitySelector
        selectedCity={selectedCity}
        onCityChange={handleCityChange}
        savedLocations={locations.map(loc => loc.city_name)}
      />

      {current && <WeatherCard data={current} />}
      
      {forecast && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            7-Day Forecast
          </h2>
          <ForecastList data={forecast} />
        </div>
      )}
    </div>
  );
};
