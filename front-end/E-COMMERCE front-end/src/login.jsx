import React, { useState } from 'react'
import { Navigate, NavLink } from 'react-router'
import { sendLoginDetails } from './utils/utils';
import { useNavigate } from 'react-router';
const Login = () => {
const [userName, setUserName] = useState('');
const [password, setPassword] = useState('');
const [loggedIn, setLoggedIn] = useState(false)
const [token, setToken] = useState('')
const navigate = useNavigate()
//username and password API 
const loginHandler = (e) => {
  e.preventDefault();

  if(userName && password){
    sendLoginDetails(userName, password).then((response) => {
    console.log(response);
    if(response.status === 200){
      setLoggedIn(true);
      setToken(response.data.token)
      console.log(token)
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user_id", response.data.user_id)
      localStorage.setItem("cart_id", response.data.cart_id)
      navigate("/")
      
    } else {
      console.log(response.status)
      alert("Username or password combination not valid")
    }
   
})
  }
  setUserName('')
  setPassword('')
};

//username & password handler to update state
const userNameHandler = (e) => {
  e.preventDefault();
  setUserName(e.target.value)
}

const passwordHandler = (e) => {
  e.preventDefault();
  setPassword(e.target.value)
}

  return (
    <div>
    <div>
      <h1>Login</h1>
      <NavLink to="/register">Register new account</NavLink>
      <NavLink to="/">Home</NavLink>
    </div>
     <div>
      <form onSubmit={loginHandler}>
        <input type="text" placeholder='username' value={userName} onChange={userNameHandler}/>
        <input type="password" placeholder='password' value={password} onChange={passwordHandler}/>
        <br />
        <button type='submit'>Login</button>
        <NavLink to='/auth0' replace={true}>Login with Google Auth0</NavLink>
      </form>
     </div>
    </div>
    
  )
}

export default Login