import { createSlice,  } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// 🧠 Application type
export interface Application {
  _id: string;
  company: string;
  role: string;
  status: "Applied" | "Phone Screen" | "Interview" | "Offer" | "Rejected";
  skills?: string[];
  suggestions?: string[];
  location?: string;
  dateApplied?: string;
  date?: string;
  jdLink?: string;
  notes?: string;
  salaryRange?: string;
  niceToHaveSkills?: string[];
  seniority?: string;
  jdText?: string;
  reminderDate?: string;
}


interface ApplicationState {
  applications: Application[];
  loading: boolean;
  error: string | null;
}


const initialState: ApplicationState = {
  applications: [],
  loading: false,
  error: null,
};


const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {

    // 🔄 Set all data (GET API)
    setApplications: (state, action: PayloadAction<Application[]>) => {
      state.applications = action.payload;
    },

    // ➕ Add new application
    addApplication: (state, action: PayloadAction<Application>) => {
      state.applications.unshift(action.payload); // top me add
    },

    // 🔄 Update (Drag & Edit)
    updateApplication: (state, action: PayloadAction<Application>) => {
      const index = state.applications.findIndex(
        (app) => app._id === action.payload._id
      );

      if (index !== -1) {
        state.applications[index] = action.payload;
      }
    },

    // ❌ Delete
    deleteApplication: (state, action: PayloadAction<string>) => {
      state.applications = state.applications.filter(
        (app) => app._id !== action.payload
      );
    },

    // ⏳ Loading
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // ⚠️ Error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

// 📦 Export actions
export const {
  setApplications,
  addApplication,
  updateApplication,
  deleteApplication,
  setLoading,
  setError,
} = applicationSlice.actions;

export default applicationSlice.reducer;