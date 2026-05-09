import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { weatherApi } from '../../shared/api/endpoints';
import { WEATHER_CONFIG } from '../../shared/config';

interface CityBase {
  city_name: string;
  country_code: string | null;
  latitude: number;
  longitude: number;
}

interface CurrentWeather extends CityBase {
  temperature: number;
  apparent_temperature: number;
  humidity: number;
  wind_speed: number;
  wind_direction: number;
  precipitation: number;
  snowfall: number;
  cloud_cover: number;
  pressure: number;
  weather_code: number;
  weather_description: string;
  is_day: number;
  fetched_at: string;
}

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

interface ForecastResponse extends CityBase {
  days: ForecastDay[];
}

interface StatsSummary extends CityBase {
  period_days: number;
  temp_avg: number | null;
  temp_max: number | null;
  temp_min: number | null;
  temp_std: number | null;
  humidity_avg: number | null;
  wind_speed_avg: number | null;
  wind_speed_max: number | null;
  precipitation_total: number | null;
  most_common_condition: string | null;
  records_count: number;
}

interface WeatherState {
  current: CurrentWeather | null;
  forecast: ForecastResponse | null;
  history: ForecastDay[];
  analysis: StatsSummary | null;
  loading: boolean;
  error: string | null;
  selectedCity: string;
}

const initialState: WeatherState = {
  current: null,
  forecast: null,
  history: [],
  analysis: null,
  loading: false,
  error: null,
  selectedCity: WEATHER_CONFIG.DEFAULT_CITY,
};

export const fetchCurrentWeather = createAsyncThunk(
  'weather/fetchCurrent',
  async (city: string) => {
    const response = await weatherApi.getCurrent(city);
    return response.data;
  }
);

export const fetchForecast = createAsyncThunk(
  'weather/fetchForecast',
  async ({ city, days }: { city: string; days?: number }) => {
    const response = await weatherApi.getForecast(city, days);
    return response.data;
  }
);

export const fetchHistory = createAsyncThunk(
  'weather/fetchHistory',
  async ({ city, limit }: { city: string; limit?: number }) => {
    const response = await weatherApi.getHistory(city, limit);
    return response.data;
  }
);

export const fetchAnalysis = createAsyncThunk(
  'weather/fetchAnalysis',
  async ({ city, days }: { city: string; days?: number }) => {
    const response = await weatherApi.getAnalysis(city, days);
    return response.data;
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload;
    },
    clearWeatherData: (state) => {
      state.current = null;
      state.forecast = null;
      state.history = [];
      state.analysis = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Current weather
      .addCase(fetchCurrentWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchCurrentWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch weather';
      })
      // Forecast
      .addCase(fetchForecast.fulfilled, (state, action) => {
        state.forecast = action.payload;
      })
      // History
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      })
      // Analysis
      .addCase(fetchAnalysis.fulfilled, (state, action) => {
        state.analysis = action.payload;
      });
  },
});

export const { setSelectedCity, clearWeatherData } = weatherSlice.actions;
export default weatherSlice.reducer;
