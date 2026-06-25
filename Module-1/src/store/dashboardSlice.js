import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dashboardApi from '../api/dashboardApi';

export const fetchDashboardSummary = createAsyncThunk(
  'dashboard/fetchSummary',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.getSummary(filters);
      if (response.success) return response.data;
      return rejectWithValue(response.message || 'Failed to fetch dashboard summary.');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch dashboard summary.');
    }
  }
);

export const fetchServiceDistribution = createAsyncThunk(
  'dashboard/fetchServiceDistribution',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.getServices(filters);
      if (response.success) return response.data;
      return rejectWithValue(response.message || 'Failed to fetch service distribution.');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch service distribution.');
    }
  }
);

export const fetchStatusDistribution = createAsyncThunk(
  'dashboard/fetchStatusDistribution',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.getStatus(filters);
      if (response.success) return response.data;
      return rejectWithValue(response.message || 'Failed to fetch status distribution.');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch status distribution.');
    }
  }
);

export const fetchMonthlyTrend = createAsyncThunk(
  'dashboard/fetchMonthlyTrend',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.getMonthlyTrend(filters);
      if (response.success) return response.data;
      return rejectWithValue(response.message || 'Failed to fetch monthly trend.');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch monthly trend.');
    }
  }
);

export const fetchRevenueAnalytics = createAsyncThunk(
  'dashboard/fetchRevenueAnalytics',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.getRevenue(filters);
      if (response.success) return response.data;
      return rejectWithValue(response.message || 'Failed to fetch revenue analytics.');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch revenue analytics.');
    }
  }
);

export const fetchManagerWorkload = createAsyncThunk(
  'dashboard/fetchManagerWorkload',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.getManagers(filters);
      if (response.success) return response.data;
      return rejectWithValue(response.message || 'Failed to fetch manager workloads.');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch manager workloads.');
    }
  }
);

export const fetchTopAccounts = createAsyncThunk(
  'dashboard/fetchTopAccounts',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.getTopAccounts(filters);
      if (response.success) return response.data;
      return rejectWithValue(response.message || 'Failed to fetch top accounts.');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch top accounts.');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    loading: false,
    error: null,
    summary: null,
    services: [],
    statuses: [],
    revenue: null,
    monthlyTrend: [],
    managerWorkload: [],
    topAccounts: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Summary
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Services
      .addCase(fetchServiceDistribution.fulfilled, (state, action) => {
        state.services = action.payload;
      })
      // Statuses
      .addCase(fetchStatusDistribution.fulfilled, (state, action) => {
        state.statuses = action.payload;
      })
      // Monthly Trend
      .addCase(fetchMonthlyTrend.fulfilled, (state, action) => {
        state.monthlyTrend = action.payload;
      })
      // Revenue
      .addCase(fetchRevenueAnalytics.fulfilled, (state, action) => {
        state.revenue = action.payload;
      })
      // Managers
      .addCase(fetchManagerWorkload.fulfilled, (state, action) => {
        state.managerWorkload = action.payload;
      })
      // Top Accounts
      .addCase(fetchTopAccounts.fulfilled, (state, action) => {
        state.topAccounts = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
