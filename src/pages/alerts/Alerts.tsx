import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import { fetchAlerts, clearAlerts } from '../../features/alerts/alertsSlice';
import { setSelectedCity } from '../../features/weather/weatherSlice';
import { AlertList } from '../../widgets/AlertList';
import { CitySelector } from '../../widgets/CitySelector';

export const Alerts: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { alerts, loading } = useSelector((state: RootState) => state.alerts);
  const { selectedCity } = useSelector((state: RootState) => state.weather);
  const { locations } = useSelector((state: RootState) => state.locations);
  const [includeForecast, setIncludeForecast] = useState(true);

  useEffect(() => {
    if (selectedCity) {
      dispatch(fetchAlerts({ city: selectedCity, includeForecast }));
    }
    
    return () => {
      dispatch(clearAlerts());
    };
  }, [dispatch, selectedCity, includeForecast]);

  const handleCityChange = (city: string) => {
    dispatch(setSelectedCity(city));
  };

  const hasAlerts = alerts && alerts.alerts && alerts.alerts.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Weather Alerts
        </h1>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={includeForecast}
              onChange={(e) => setIncludeForecast(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-600">Include forecast days</span>
          </label>
        </div>
      </div>

      <CitySelector
        selectedCity={selectedCity}
        onCityChange={handleCityChange}
        savedLocations={locations.map(loc => loc.city_name)}
      />

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking for alerts...</p>
        </div>
      )}

      {!loading && alerts && (
        <>
          {hasAlerts ? (
            <AlertList alerts={alerts} />
          ) : (
            <div className="weather-card text-center">
              <div className="text-green-500 text-6xl mb-4">✓</div>
              <h3 className="text-xl font-semibold mb-2">No Active Alerts</h3>
              <p className="text-gray-600">
                Weather conditions are normal in {alerts.city_name}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
