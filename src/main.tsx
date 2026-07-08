import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SkinProvider } from './skins/SkinContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SkinProvider>
      <App />
    </SkinProvider>
  </StrictMode>,
)

// Only register in production: a fetch-handling service worker fighting Vite's
// dev server would make local HMR serve stale cached responses.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
}
