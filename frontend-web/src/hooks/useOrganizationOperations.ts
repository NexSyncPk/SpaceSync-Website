import { useState } from 'react';
import { useDispatch } from '@/store/hooks';
import { setLoading, setError, clearError, updateAuthData } from '@/store/slices/authSlice';
import { setOrganization } from '@/store/slices/organizationSlice';
import { createOrganization, joinOrganization, getCurrentProfile, refreshAllOrganizationData } from '@/api/services/userService';
import toast from 'react-hot-toast';

export const useOrganizationOperations = () => {
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCreateOrganization = async (organizationData: any) => {
    setIsProcessing(true);
    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      const response = await createOrganization(organizationData);
      
      if (response && response.data) {
        toast.success(response.message || 'Organization created successfully!');
        
        // Update organization state immediately
        if (response.data.organization) {
          dispatch(setOrganization(response.data.organization));
        }
        
        // Use comprehensive refresh to update all organization-related data
        if (response.data.organization?.id) {
          await refreshAllOrganizationData(response.data.organization.id);
        }
        
        return { success: true, data: response.data };
      } else {
        throw new Error('Failed to create organization');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create organization';
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsProcessing(false);
      dispatch(setLoading(false));
    }
  };

  const handleJoinOrganization = async (inviteKey: string) => {
    setIsProcessing(true);
    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      const response = await joinOrganization({ inviteKey });
      
      if (response && response.data) {
        toast.success(response.data.message || 'Successfully joined organization!');
        
        // Update organization state immediately
        if (response.data.organization) {
          dispatch(setOrganization(response.data.organization));
        }
        
        // Use comprehensive refresh to update all organization-related data
        if (response.data.organization?.id) {
          await refreshAllOrganizationData(response.data.organization.id);
        }
        
        return { success: true, data: response.data };
      } else {
        throw new Error('Failed to join organization');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to join organization';
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsProcessing(false);
      dispatch(setLoading(false));
    }
  };

  const refreshProfile = async () => {
    try {
      await getCurrentProfile();
      return { success: true };
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to refresh profile';
      console.error('Error refreshing profile:', errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const forceRefreshOrganizationData = async (organizationId?: string) => {
    try {
      // First refresh the current profile to get latest user data
      const profileResult = await getCurrentProfile();
      
      // If we have an organization ID or can get it from the refreshed profile
      const orgId = organizationId || (profileResult && profileResult.data?.user?.organizationId);
      
      if (orgId) {
        await refreshAllOrganizationData(orgId);
      }
      
      return { success: true };
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to refresh organization data';
      console.error('Error refreshing organization data:', errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    handleCreateOrganization,
    handleJoinOrganization,
    refreshProfile,
    forceRefreshOrganizationData,
    isProcessing
  };
};
