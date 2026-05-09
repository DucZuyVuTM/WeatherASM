import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { locationsApi } from '../../shared/api/endpoints';

interface Location {
  id: number;
  city_name: string;
  country_code: string | null;
  latitude: number;
  longitude: number;
  created_at: string;
}

interface LocationsState {
  locations: Location[];
  loading: boolean;
  error: string | null;
}

const initialState: LocationsState = {
  locations: [],
  loading: false,
  error: null,
};

export const fetchLocations = createAsyncThunk(
  'locations/fetch',
  async () => {
    const response = await locationsApi.getMyLocations();
    return response.data;
  }
);

export const addLocation = createAsyncThunk(
  'locations/add',
  async (city_name: string) => {
    const response = await locationsApi.addLocation(city_name);
    return response.data;
  }
);

export const deleteLocation = createAsyncThunk(
  'locations/delete',
  async (locationId: number) => {
    await locationsApi.deleteLocation(locationId);
    return locationId;
  }
);

const locationsSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch locations';
      })
      .addCase(addLocation.fulfilled, (state, action) => {
        state.locations.push(action.payload);
      })
      .addCase(deleteLocation.fulfilled, (state, action) => {
        state.locations = state.locations.filter(loc => loc.id !== action.payload);
      });
  },
});

export default locationsSlice.reducer;
