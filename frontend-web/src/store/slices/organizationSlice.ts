import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Organization {
  id: string;
  name: string;
  description?: string;
  industry?: string;
  role?: "admin" | "member";
  memberCount?: number;
  createdAt?: string;
  joinedAt?: string;
  inviteCode?: string;
  inviteKey?: string;
  Users?: any[];
  Rooms?: any[];
  // Allow additional properties for API response data
  [key: string]: any;
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
      // Normalize the organization data to ensure consistent structure
      const organization = {
        ...action.payload,
        memberCount: action.payload.Users?.length || action.payload.memberCount || 0,
        inviteCode: action.payload.inviteKey || action.payload.inviteCode,
      };
      
      state.current = organization;
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