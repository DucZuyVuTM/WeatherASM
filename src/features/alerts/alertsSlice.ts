import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { weatherApi } from '../../shared/api/endpoints';

interface WeatherAlert {
  level: string;
  type: string;
  message: string;
  value: number;
  threshold: number;
  unit: string;
}

interface AlertsResponse {
  city_name: string;
  country_code: string | null;
  alerts: WeatherAlert[];
}

interface AlertsState {
  alerts: AlertsResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: AlertsState = {
  alerts: null,
  loading: false,
  error: null,
};

export const fetchAlerts = createAsyncThunk(
  'alerts/fetch',
  async ({ city, includeForecast }: { city: string; includeForecast?: boolean }) => {
    const response = await weatherApi.getAlerts(city, includeForecast);
    return response.data;
  }
);

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    clearAlerts: (state) => {
      state.alerts = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = action.payload;
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch alerts';
      });
  },
});

export const { clearAlerts } = alertsSlice.actions;
export default alertsSlice.reducer;
