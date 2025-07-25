import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeSupabase } from './lib/supabase';

// Initialize Supabase before rendering
initializeSupabase().then((initialized) => {
  if (!initialized) {
    console.error('Failed to initialize Supabase');
  }
  
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});