import { store } from '@/store/store';
import { updateAuthData } from '@/store/slices/authSlice';
import { getUserFromToken, isTokenExpired } from './helpers';

/**
 * Utility to check if the current token needs refreshing
 */
export const shouldRefreshToken = (): boolean => {
  const state = store.getState();
  const token = state.auth.token;
  
  if (!token) return false;
  
  // Check if token is expired or will expire soon (within 5 minutes)
  if (isTokenExpired(token)) return true;
  
  try {
    const payload = getUserFromToken(token);
    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = payload.exp - currentTime;
    
    // Refresh if token expires within 5 minutes (300 seconds)
    return timeUntilExpiry < 300;
  } catch (error) {
    console.error('Error checking token expiry:', error);
    return true;
  }
};

/**
 * Updates the auth store with new token and user data
 */
export const updateTokenInStore = (tokenData: {
  user?: any;
  token?: string;
  canCreateOrganization?: boolean;
  canJoinOrganization?: boolean;
}) => {
  store.dispatch(updateAuthData(tokenData));
};

/**
 * Extracts user data from JWT token payload
 */
export const extractUserDataFromToken = (token: string) => {
  try {
    const payload = getUserFromToken(token);
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      organizationId: payload.organizationId || null,
    };
  } catch (error) {
    console.error('Error extracting user data from token:', error);
    return null;
  }
};

/**
 * Validates that the token contains expected organization data
 */
export const validateTokenOrganizationData = (token: string, expectedOrgId?: string | null): boolean => {
  try {
    const userData = extractUserDataFromToken(token);
    if (!userData) return false;
    
    if (expectedOrgId !== undefined) {
      return userData.organizationId === expectedOrgId;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating token organization data:', error);
    return false;
  }
};
