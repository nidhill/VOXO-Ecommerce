import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Toaster } from 'sonner'
import './styles/tailwind.css'
import './styles/global.css'
import './styles/responsive.css'
import App from './App.jsx'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Register once globally so all components share the same plugin instance
gsap.registerPlugin(ScrollTrigger)

// After all images/fonts finish loading, recalculate every trigger position
// so animations fire at the correct scroll offsets in production
window.addEventListener('load', () => ScrollTrigger.refresh())

const queryClient = new QueryClient()

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#ffffff',
              color: '#111111',
              border: '1px solid #e8e8e8',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '13px',
            },
          }}
        />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
