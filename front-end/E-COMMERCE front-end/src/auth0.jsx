import React, { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router';
import { postNewUser } from './utils/utils';
import { randomUsernameGenerator } from './utils/utils';

export default function Auth0() {

const navigate = useNavigate()
  
    
  return (
    <div>
        <GoogleLogin onSuccess={async (credentialResponse) => {
            console.log(jwtDecode(credentialResponse.credential))
            localStorage.setItem("token", `Bearer ${credentialResponse.credential}`)
            console.log('token set')
            const response = jwtDecode(credentialResponse.credential)
            const password = response.nbf;
            const cart_id = response.exp
            
            const username = randomUsernameGenerator(response.name)
            const token = localStorage.getItem('token')
           const newUser = await postNewUser(response.name, username, response.email, password, token)
           console.log(newUser)

            navigate('/')
        }} onError={() => { alert("Login failed")}}/>

    </div>
    
  )
}
