import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Homepage from './homepage'
import Login from './login'
import { Register } from './register'
import { Checkout } from './checkout'
import Hats from './categories/hats'
import Shirts from './categories/shirts'
import Jumpers from './categories/jumpers'
import Coats from './categories/coats'
import Cart from './cart'
import Auth0 from './auth0'
import { Route, Routes, BrowserRouter } from 'react-router'
import Orders from './orders'

function App() {
  

  return (
    <div>
<BrowserRouter>
<Routes>
         <Route path="/" element={<Homepage/>} />
        <Route path="/login" element={<Login />} />
        <Route path='/auth0' element={<Auth0 />} />
        <Route path="/register" element={<Register />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/cart" element={<Cart />} >
          <Route path='/cart/checkout' element={<Checkout/>} />
        </Route>

        <Route path="/categories/hats" element={<Hats />} />
        <Route path="/categories/shirts" element={<Shirts />} />
        <Route path="/categories/jumpers" element={<Jumpers />} />
        <Route path="/categories/coats" element={<Coats />} />
      </Routes>

</BrowserRouter>

    </div>
  )
}

export default App
