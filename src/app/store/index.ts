import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice';
import weatherReducer from '../../features/weather/weatherSlice';
import locationsReducer from '../../features/locations/locationsSlice';
import alertsReducer from '../../features/alerts/alertsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    weather: weatherReducer,
    locations: locationsReducer,
    alerts: alertsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
