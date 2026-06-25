import { configureStore } from '@reduxjs/toolkit';
import accountsReducer from './accountsSlice';
import projectsReducer from './projectsSlice';
import servicesReducer from './servicesSlice';
import dashboardReducer from './dashboardSlice';

export const store = configureStore({
  reducer: {
    accounts: accountsReducer,
    projects: projectsReducer,
    services: servicesReducer,
    dashboard: dashboardReducer,
  },
});

export default store;
