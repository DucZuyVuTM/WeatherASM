import React, { useState } from 'react';
import { weatherApi } from '../../shared/api/endpoints';

interface CityCompareItem {
  city_name: string;
  temperature: number;
  apparent_temperature: number;
  humidity: number;
  wind_speed: number;
  weather_description: string;
}

interface CompareData {
  cities: CityCompareItem[];
  warmest: string;
  coldest: string;
  most_humid: string;
  windiest: string;
}

export const Compare: React.FC = () => {
  const [citiesInput, setCitiesInput] = useState('');
  const [compareData, setCompareData] = useState<CompareData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCompare = async () => {
    if (!citiesInput.trim()) {
      setError('Please enter at least one city');
      return;
    }

    const cities = citiesInput.split(',').map(c => c.trim()).filter(c => c);
    if (cities.length < 2) {
      setError('Please enter at least 2 cities to compare');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await weatherApi.compareCities(cities);
      setCompareData(response.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to compare cities');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Compare Cities
      </h1>

      <div className="weather-card">
        <label className="block text-sm font-medium mb-2">
          Enter cities (comma-separated)
        </label>
        <div className="flex space-x-4">
          <input
            type="text"
            value={citiesInput}
            onChange={(e) => setCitiesInput(e.target.value)}
            placeholder="e.g., Hanoi, Ho Chi Minh City, Da Nang"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCompare}
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Comparing...' : 'Compare'}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {compareData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="weather-card text-center">
              <div className="text-red-500 text-3xl mb-2">🔥</div>
              <div className="text-sm text-gray-600">Warmest</div>
              <div className="text-xl font-bold">{compareData.warmest}</div>
            </div>
            <div className="weather-card text-center">
              <div className="text-blue-500 text-3xl mb-2">❄️</div>
              <div className="text-sm text-gray-600">Coldest</div>
              <div className="text-xl font-bold">{compareData.coldest}</div>
            </div>
            <div className="weather-card text-center">
              <div className="text-cyan-500 text-3xl mb-2">💧</div>
              <div className="text-sm text-gray-600">Most Humid</div>
              <div className="text-xl font-bold">{compareData.most_humid}</div>
            </div>
            <div className="weather-card text-center">
              <div className="text-gray-500 text-3xl mb-2">💨</div>
              <div className="text-sm text-gray-600">Windiest</div>
              <div className="text-xl font-bold">{compareData.windiest}</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">City</th>
                  <th className="px-6 py-3 text-left">Temp (°C)</th>
                  <th className="px-6 py-3 text-left">Feels Like</th>
                  <th className="px-6 py-3 text-left">Humidity</th>
                  <th className="px-6 py-3 text-left">Wind (km/h)</th>
                  <th className="px-6 py-3 text-left">Condition</th>
                </tr>
              </thead>
              <tbody>
                {compareData.cities.map((city, idx) => (
                  <tr key={idx} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="px-6 py-4 font-medium">{city.city_name}</td>
                    <td className="px-6 py-4">{city.temperature}°C</td>
                    <td className="px-6 py-4">{city.apparent_temperature}°C</td>
                    <td className="px-6 py-4">{city.humidity}%</td>
                    <td className="px-6 py-4">{city.wind_speed}</td>
                    <td className="px-6 py-4">{city.weather_description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
