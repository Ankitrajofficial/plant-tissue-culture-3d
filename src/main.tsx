import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Note: React.StrictMode is intentionally not used. In development it double-
// mounts components, which makes drei's <Html> helper log a harmless
// "Attempted to synchronously unmount a root" warning on every label.
createRoot(document.getElementById('root')!).render(<App />)
