import { setOrganization } from "@/store/slices/organizationSlice";
import { updateUser } from "@/store/slices/authSlice";
import { ORGANIZATION_BY_ID, USER_PROFILE } from "@/api/endpoints";
import api from "@/api/interceptor";

/**
 * Refreshes organization and user data after successful create/join operations
 * This ensures the frontend state reflects the latest server state
 */
export const refreshOrganizationData = async (organizationId: string, dispatch: any) => {
  try {
    console.log("Refreshing organization data for ID:", organizationId);
    
    // Fetch updated organization data with fresh member count and rooms
    const [orgResponse, userResponse] = await Promise.all([
      api.get(ORGANIZATION_BY_ID(organizationId)),
      api.get(USER_PROFILE)
    ]);

    if (orgResponse.data && orgResponse.data.data) {
      // Update organization state with fresh data including member count
      const organizationData = {
        ...orgResponse.data.data,
        memberCount: orgResponse.data.data.Users?.length || 0,
        // Ensure we have all the necessary fields
        inviteKey: orgResponse.data.data.inviteKey || orgResponse.data.data.inviteCode,
      };
      
      console.log("Refreshed organization data:", organizationData);
      dispatch(setOrganization(organizationData));
      
      // Store member count separately if needed
      if (organizationData.Users) {
        console.log(`Organization now has ${organizationData.Users.length} members`);
      }
    }

    if (userResponse.data && userResponse.data.data) {
      // Update user state with fresh profile data
      const userData = userResponse.data.data;
      console.log("Refreshed user data:", userData);
      
      dispatch(updateUser({
        ...userData,
        organizationId: organizationId,
      }));
    }

    console.log("✅ Successfully refreshed organization and user data");
    return true;
  } catch (error) {
    console.error("❌ Error refreshing organization data:", error);
    
    // Log more details about the error
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    
    // Don't throw error to avoid disrupting the main flow
    // but return false to indicate failure
    return false;
  }
};

/**
 * Triggers a refresh of room data - useful for components that depend on rooms
 * This can be called from useReqAndRoom hook or other room-dependent components
 */
export const triggerRoomRefresh = (refetchFunction?: () => void) => {
  if (refetchFunction) {
    console.log("🔄 Triggering room data refresh");
    refetchFunction();
  } else {
    console.log("⚠️ No refetch function provided for room refresh");
  }
};

/**
 * Clears organization-related cached data
 * Useful when user leaves an organization or during logout
 */
export const clearOrganizationCache = () => {
  // If you're using any caching mechanism, clear it here
  console.log("🧹 Clearing organization cache");
  // You can add localStorage clearing or cache invalidation here if needed
  
  // Example: Clear any organization-related data from localStorage
  // localStorage.removeItem('organization-cache');
  // localStorage.removeItem('rooms-cache');
};
