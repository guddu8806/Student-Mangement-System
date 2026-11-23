import { createRoot } from 'react-dom/client'
import App from '../src/app/App'
import './styles/index.css';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./lib/queryClient";

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
  // {/* </StrictMode> */}
)
