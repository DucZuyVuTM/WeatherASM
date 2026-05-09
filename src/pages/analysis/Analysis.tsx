import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import { fetchAnalysis, setSelectedCity } from '../../features/weather/weatherSlice';
import { StatsChart } from '../../widgets/StatsChart';
import { CitySelector } from '../../widgets/CitySelector';
import { WEATHER_CONFIG } from '../../shared/config';

export const Analysis: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { analysis, loading, selectedCity } = useSelector((state: RootState) => state.weather);
  const { locations } = useSelector((state: RootState) => state.locations);
  const [analysisDays, setAnalysisDays] = useState(WEATHER_CONFIG.ANALYSIS_DAYS);

  useEffect(() => {
    if (selectedCity) {
      dispatch(fetchAnalysis({ city: selectedCity, days: analysisDays }));
    }
  }, [dispatch, selectedCity, analysisDays]);

  const handleCityChange = (city: string) => {
    dispatch(setSelectedCity(city));
  };

  if (loading && !analysis) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Analyzing weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Weather Analysis
        </h1>
        <div className="flex items-center space-x-4">
          <label className="text-sm text-gray-600">Period:</label>
          <select
            value={analysisDays}
            onChange={(e) => setAnalysisDays(Number(e.target.value))}
            className="px-3 py-2 border rounded-lg dark:bg-gray-700"
          >
            {[7, 14, 30, 60, 90].map(days => (
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

      {analysis && <StatsChart data={analysis} />}
    </div>
  );
};
