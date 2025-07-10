import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Organization {
  id: string;
  name: string;
  description: string;
  industry: string;
  role: "admin" | "member";
  memberCount: number;
  createdAt?: string;
  joinedAt?: string;
  inviteCode?: string;
}

interface OrganizationState {
  current: Organization | null;
  hasSelectedOrganization: boolean;
}

const initialState: OrganizationState = {
  current: null,
  hasSelectedOrganization: false,
};

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    setOrganization: (state, action: PayloadAction<Organization>) => {
      state.current = action.payload;
      state.hasSelectedOrganization = true;
    },
    clearOrganization: (state) => {
      state.current = null;
      state.hasSelectedOrganization = false;
    },
  },
});

export const { setOrganization, clearOrganization } = organizationSlice.actions;
export default organizationSlice.reducer;