import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectApi from '../api/projectApi';

export const fetchFilteredProjects = createAsyncThunk(
  'projects/fetchFilteredProjects',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await projectApi.getFilteredProjects(filters);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to fetch projects.');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch projects.');
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await projectApi.createProject(projectData);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to create project.');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to create project.');
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, projectData }, { rejectWithValue }) => {
    try {
      const response = await projectApi.updateProject(id, projectData);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to update project.');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to update project.');
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id, { rejectWithValue }) => {
    try {
      const response = await projectApi.deleteProject(id);
      if (response.success) {
        return id;
      }
      return rejectWithValue(response.message || 'Failed to delete project.');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to delete project.');
    }
  }
);

export const importProjects = createAsyncThunk(
  'projects/importProjects',
  async (projectsList, { rejectWithValue }) => {
    try {
      const results = [];
      const errors = [];
      
      // Save projects in sequence/parallel to the database
      for (const proj of projectsList) {
        try {
          const response = await projectApi.createProject(proj);
          if (response.success) {
            results.push(response.data);
          } else {
            errors.push(response.message || `Failed to import project ${proj.projectCode}`);
          }
        } catch (e) {
          errors.push(e.response?.data?.message || e.message || `Error importing project ${proj.projectCode}`);
        }
      }

      if (errors.length > 0 && results.length === 0) {
        return rejectWithValue(`All imports failed: ${errors.join('; ')}`);
      }

      return { results, errors };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to import projects.');
    }
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    list: [],
    loading: false,
    error: null,
    // Phase 2: imported undo stack helper
    lastImportedIds: null,
  },
  reducers: {
    setLastImportedIds: (state, action) => {
      state.lastImportedIds = action.payload;
    },
    clearLastImportedIds: (state) => {
      state.lastImportedIds = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Projects
      .addCase(fetchFilteredProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchFilteredProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Project
      .addCase(createProject.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      // Update Project
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.list.findIndex((p) => p.id === action.payload.id || p.projectCode === action.payload.projectCode);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      // Delete Project
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p.id !== action.payload);
      })
      // Import Projects
      .addCase(importProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(importProjects.fulfilled, (state, action) => {
        state.loading = false;
        const imported = action.payload.results;
        state.list = [...imported, ...state.list];
        state.lastImportedIds = imported.map(p => p.id);
      })
      .addCase(importProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setLastImportedIds, clearLastImportedIds } = projectsSlice.actions;
export default projectsSlice.reducer;
