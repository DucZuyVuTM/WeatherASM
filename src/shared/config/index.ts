export const API_CONFIG = {
  BASE_URL: import.meta.env.REACT_APP_API_URL || 'http://localhost:8000',
  TIMEOUT: 30000,
  REFRESH_TOKEN_URL: '/auth/refresh',
};

export const WEATHER_CONFIG = {
  DEFAULT_CITY: 'Hanoi',
  DEFAULT_FORECAST_DAYS: 7,
  MAX_FORECAST_DAYS: 16,
  HISTORY_LIMIT: 20,
  ANALYSIS_DAYS: 7,
  AUTO_REFRESH_INTERVAL: 300000, // 5 minutes
};

export const ALERT_THRESHOLDS = {
  TEMP_HIGH: 35, // °C
  TEMP_LOW: 0,   // °C
  WIND_HIGH: 50, // km/h
  RAIN_HIGH: 10, // mm
  SNOW_HIGH: 5,  // mm
};
