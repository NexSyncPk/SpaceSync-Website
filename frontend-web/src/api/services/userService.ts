import { ORGANIZATIONS, ROOMS, USER_BY_ID, USER_CREATE_ORGANIZATION, USER_JOIN_ORGANIZATION, USER_CURRENT_PROFILE } from "../endpoints";
import api from "../interceptor";
import { store } from "@/store/store";
import { updateAuthData } from "@/store/slices/authSlice";

const fetchOrganizationByUser = (organizationId: string)=>{
    try{
        const response = api.get(`/organization/${organizationId}`);
        return response;

    }catch(error){
     console.log("❌ Error fetching organization: ", error);   
     return false;
    }
}

const getUserById = (userId:string)=>{
    try {
        const response = api.get(USER_BY_ID(userId));
        return response;
    } catch (error) {
        console.log("Error: ", error);
        return false;
    }
}
const createOrganization = async (data: any) => {
    try {
        const response = await api.post(USER_CREATE_ORGANIZATION, data);
        
        if (response.data?.token) {
            store.dispatch(updateAuthData({
                user: response.data.user,
                token: response.data.token,
                canCreateOrganization: false,
                canJoinOrganization: false
            }));
        }
        
        return response;
    } catch (error) {
        console.log("error: ", error);
        return false;
    }
}

const joinOrganization = async (data: any) => {
    try {
        const response = await api.post(USER_JOIN_ORGANIZATION, data);
        
        if (response.data?.token) {
            store.dispatch(updateAuthData({
                user: response.data.user,
                token: response.data.token,
                canCreateOrganization: false,
                canJoinOrganization: false
            }));
        }
        
        return response;
    } catch (error) {
        console.log("Error: ", error);
        return false;
    }
}

const getAllOrganizations = ()=>{
    try {
        const response = api.get(ORGANIZATIONS);
        return response;
    } catch (error) {
        console.log("Error: ",error);
        return false;
    }
}

const getAllRooms = ()=>{
    try {
        const response = api.get(ROOMS);
        return response;
    } catch (error) {
        console.log("error: ", error);
        return false;
    }
}

const getCurrentProfile = async () => {
    try {
        const response = await api.get(USER_CURRENT_PROFILE);
        
        if (response.data?.user) {
            store.dispatch(updateAuthData({
                user: response.data.user,
                canCreateOrganization: response.data.canCreateOrganization,
                canJoinOrganization: response.data.canJoinOrganization
            }));
        }
        
        return response;
    } catch (error) {
        console.log("error: ", error);
        return false;
    }
}

const refreshAllOrganizationData = async (organizationId: string) => {
    try {
        const [profileResponse, orgResponse] = await Promise.all([
            api.get(USER_CURRENT_PROFILE),
            api.get(`/organization/${organizationId}`).catch(() => {
                // If direct org endpoint fails, try to get org data from user profile
                return null;
            })
        ]);
        
        if (profileResponse && profileResponse.data?.user) {
            store.dispatch(updateAuthData({
                user: profileResponse.data.user,
                canCreateOrganization: profileResponse.data.canCreateOrganization,
                canJoinOrganization: profileResponse.data.canJoinOrganization
            }));
            
            // If we have fresh user data with organization info, use that
            if (profileResponse.data.user.organizationId === organizationId) {
                // Try to get organization data from user's associations or create basic structure
                const orgData = {
                    id: organizationId,
                    name: profileResponse.data.user.Organization?.name || 'Unknown Organization',
                    memberCount: 1, // Will be updated by the organization endpoint if available
                    ...profileResponse.data.user.Organization
                };
                
                const { setOrganization } = await import('@/store/slices/organizationSlice');
                store.dispatch(setOrganization(orgData));
            }
        }
        
        // Update organization data with fresh member count if we got organization response
        if (orgResponse && orgResponse.data) {
            const organizationData = {
                ...orgResponse.data,
                memberCount: orgResponse.data.Users?.length || orgResponse.data.memberCount || 0
            };
            
            const { setOrganization } = await import('@/store/slices/organizationSlice');
            store.dispatch(setOrganization(organizationData));
        }
        
        return { success: true };
    } catch (error) {
        console.log("error refreshing organization data: ", error);
        return { success: false, error };
    }
}

export{
    fetchOrganizationByUser,
    createOrganization,
    getAllRooms,
    getUserById,
    getAllOrganizations,
    joinOrganization,
    getCurrentProfile,
    refreshAllOrganizationData
}