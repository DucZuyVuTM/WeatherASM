import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import { fetchForecast, setSelectedCity } from '../../features/weather/weatherSlice';
import { ForecastList } from '../../widgets/ForecastList';
import { CitySelector } from '../../widgets/CitySelector';
import { WEATHER_CONFIG } from '../../shared/config';

export const Forecast: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { forecast, loading, selectedCity } = useSelector((state: RootState) => state.weather);
  const { locations } = useSelector((state: RootState) => state.locations);
  const [forecastDays, setForecastDays] = useState(WEATHER_CONFIG.DEFAULT_FORECAST_DAYS);

  useEffect(() => {
    if (selectedCity) {
      dispatch(fetchForecast({ city: selectedCity, days: forecastDays }));
    }
  }, [dispatch, selectedCity, forecastDays]);

  const handleCityChange = (city: string) => {
    dispatch(setSelectedCity(city));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Weather Forecast
        </h1>
        <div className="flex items-center space-x-4">
          <label className="text-sm text-gray-600">Days:</label>
          <select
            value={forecastDays}
            onChange={(e) => setForecastDays(Number(e.target.value))}
            className="px-3 py-2 border rounded-lg dark:bg-gray-700"
          >
            {[3, 5, 7, 10, 14, 16].map(days => (
              <option key={days} value={days}>{days} days</option>
            ))}
          </select>
        </div>
      </div>

      <CitySelector
        selectedCity={selectedCity}
        onCityChange={handleCityChange}
        savedLocations={locations.map(loc => loc.city_name)}
      />

      {loading && !forecast && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      )}

      {forecast && <ForecastList data={forecast} detailed />}
    </div>
  );
};
