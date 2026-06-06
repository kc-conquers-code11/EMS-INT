import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '../reactQuery/rqClient.tsx';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { hydrateAuthThunk } from './features/auth/authSlice';

// Dispatch hydrateAuthThunk before first render to populate the auth state from storage
store.dispatch(hydrateAuthThunk());

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <QueryClientProvider client={getQueryClient()}>
      {/* <StrictMode> */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
      {/* </StrictMode> */}
    </QueryClientProvider>
  </Provider>
);
