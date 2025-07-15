import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { refreshOrganizationData } from '../utils/organizationHelpers';

/**
 * Custom hook for refreshing organization data
 * Provides a simple way to refresh organization and user data from any component
 */
export const useRefreshOrganization = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
  const organization = useSelector((state: any) => state.organization.current);

  const refreshData = useCallback(async () => {
    if (user?.organizationId) {
      console.log('Refreshing organization data for ID:', user.organizationId);
      await refreshOrganizationData(user.organizationId, dispatch);
      return true;
    } else {
      console.log('No organization ID found, skipping refresh');
      return false;
    }
  }, [user?.organizationId, dispatch]);

  return {
    refreshOrganizationData: refreshData,
    hasOrganization: !!user?.organizationId,
    organizationId: user?.organizationId,
    organization,
    user
  };
};

/**
 * Custom hook that automatically refreshes organization data when the component mounts
 * Useful for components that need fresh organization data on load
 */
export const useAutoRefreshOrganization = () => {
  const { refreshOrganizationData, ...rest } = useRefreshOrganization();

  // Auto-refresh on mount if user has an organization
  useEffect(() => {
    refreshOrganizationData();
  }, [refreshOrganizationData]);

  return { refreshOrganizationData, ...rest };
};
