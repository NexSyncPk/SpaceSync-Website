import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store.js";
import { initializeInterceptor } from "./api/interceptor";
import App from "./App.js";
import LoadingSpinner from "./components/shared/LoadingSpinner.js";
import "./index.css";

// Initialize API interceptor with Redux dispatch
initializeInterceptor(store.dispatch);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
);
