import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from '@/contexts/AuthContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { Toaster } from '@/components/ui/sonner'
import { FirebaseSetupNotice } from '@/components/FirebaseSetupNotice'
import { isFirebaseConfigured } from '@/firebase/firebase'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isFirebaseConfigured ? (
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <App />
            <Toaster />
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    ) : (
      <FirebaseSetupNotice />
    )}
  </StrictMode>,
)
