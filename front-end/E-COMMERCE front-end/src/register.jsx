import React from 'react'
import { NavLink } from 'react-router'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { sendRegisterDetails } from './utils/utils'

export const Register = () => {

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loggedIn, setLoggedIn] = useState(false)
  const [token, setToken] = useState('')
  const navigate = useNavigate()

  const submitDetails = (e) => {
    e.preventDefault()

    if(name && email && userName && password){
       sendRegisterDetails(name, email, userName, password).then((response) => {
    console.log(response)
    if(response.status === 201){
      alert(`${response.data.message}`)
      navigate(`/login`)
    }
    else{
      alert("Error in data input, you may already have an account or you may need to use a different email or username")
      setName('');
      setEmail('');
      setUserName('');
      setPassword('');
    }
    });
      
  } else {
  alert("Please insert valid name, email, username & password")
  setName(''); 
  setEmail('');
      setUserName('');
      setPassword('');
 }
} 
  
  const nameHandler = (e) => {
    e.preventDefault();
    setName(e.target.value)
  }
 const emailHandler = (e) => {
  e.preventDefault();
  setEmail(e.target.value)
 }

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
        <h1>Register</h1>
        <NavLink to="/login">Already have an account ?</NavLink>
        <NavLink to="/">Home</NavLink>
      </div>
       <div>
        <form onSubmit={submitDetails}>
        <input type='text' placeholder='name' value={name} onChange={nameHandler}/>
          <input type='email' placeholder='email' value={email} onChange={emailHandler}/>
          <input type="text" placeholder='username' value={userName} onChange={userNameHandler}/>
          <input type="password" placeholder='password' value={password} onChange={passwordHandler}/>
          <br />
          <button type='submit'>Register</button>
        </form>
       </div>
      </div>
      
    )
  }
  

