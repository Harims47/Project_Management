import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import serviceApi from '../api/serviceApi';

export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await serviceApi.getServices();
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to fetch services.');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch services.');
    }
  }
);

const servicesSlice = createSlice({
  name: 'services',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default servicesSlice.reducer;
