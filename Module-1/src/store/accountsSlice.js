import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import accountApi from '../api/accountApi';

export const fetchAccounts = createAsyncThunk(
  'accounts/fetchAccounts',
  async ({ search, sortColumn, sortDirection } = {}, { rejectWithValue }) => {
    try {
      const response = await accountApi.getAllAccounts(search, sortColumn, sortDirection);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to fetch accounts.');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch accounts.');
    }
  }
);

export const fetchAccountById = createAsyncThunk(
  'accounts/fetchAccountById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await accountApi.getAccountById(id);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to fetch account.');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch account.');
    }
  }
);

export const createAccount = createAsyncThunk(
  'accounts/createAccount',
  async (accountData, { rejectWithValue }) => {
    try {
      const response = await accountApi.createAccount(accountData);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to create account.');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to create account.');
    }
  }
);

export const updateAccount = createAsyncThunk(
  'accounts/updateAccount',
  async ({ id, accountData }, { rejectWithValue }) => {
    try {
      const response = await accountApi.updateAccount(id, accountData);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to update account.');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to update account.');
    }
  }
);

export const deleteAccount = createAsyncThunk(
  'accounts/deleteAccount',
  async (id, { rejectWithValue }) => {
    try {
      const response = await accountApi.deleteAccount(id);
      if (response.success) {
        return id;
      }
      return rejectWithValue(response.message || 'Failed to delete account.');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to delete account.');
    }
  }
);

const accountsSlice = createSlice({
  name: 'accounts',
  initialState: {
    list: [],
    currentAccount: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Accounts
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Account By Id
      .addCase(fetchAccountById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAccount = action.payload;
      })
      .addCase(fetchAccountById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Account
      .addCase(createAccount.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      // Update Account
      .addCase(updateAccount.fulfilled, (state, action) => {
        const index = state.list.findIndex((acc) => acc.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.currentAccount && state.currentAccount.id === action.payload.id) {
          state.currentAccount = action.payload;
        }
      })
      // Delete Account
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.list = state.list.filter((acc) => acc.id !== action.payload);
        if (state.currentAccount && state.currentAccount.id === action.payload) {
          state.currentAccount = null;
        }
      });
  },
});

export default accountsSlice.reducer;
