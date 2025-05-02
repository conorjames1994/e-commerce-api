import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

const google_id = "390094055035-ts41a8vd2b3l4far9kq63furok9i52sf.apps.googleusercontent.com"

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <GoogleOAuthProvider clientId={google_id}>
     <App/> 
    </GoogleOAuthProvider>
   
  </StrictMode>,
  
  
)
