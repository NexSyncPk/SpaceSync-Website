// Setup utility for integrating API interceptor with Redux store
import { store } from '@/store/store';
import { initializeInterceptor } from './interceptor';

// Initialize the API interceptor with Redux store
export const setupApiInterceptor = () => {
  initializeInterceptor(store.dispatch);
};
