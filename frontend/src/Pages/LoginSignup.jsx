import React, { useState } from 'react'
import './CSS/LoginSignup.css'

export const LoginSignup = () => {
 
   const [state,setstate]=useState("Login")
   const [formData, setformData]=useState({
    username:"",
    password:"",
    email:""
   })
         const changehandler=(e)=>{
          setformData({...formData,[e.target.name]:e.target.value})
         }

   const login =async ()=>{
    console.log("login function executed", formData);

    let responseData;
    await fetch('http://localhost:4000/login',{
      method:'POST',
      headers:{
        Accept:'application/form-data',
        'content-type':'application/json',
      },
      body:JSON.stringify(formData),
    }).then((resp)=>resp.json()).then((data)=>responseData=data)

    if(responseData.success){
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace("/");
    }
    else{
      alert(responseData.errors);
    }
   }

   const signup = async ()=>{
    console.log("signup finction executed", formData);
    let responseData;
    await fetch('http://localhost:4000/signup',{
      method:'POST',
      headers:{
        Accept:'application/form-data',
        'content-type':'application/json',
      },
      body:JSON.stringify(formData),
    }).then((resp)=>resp.json()).then((data)=>responseData=data)

    if(responseData.success){
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace("/");
    }
    else{
      alert(responseData.errors);
    }
   }

  return (
    <div className='loginsignup'>
      <div className='loginsignup-container' >
        <h1>{state}</h1>
        <div className='loginsignup-fields'>
        {state==='sign-up'?<input name='username' value={formData.username} onChange={changehandler}  type="text" placeholder='your name' />:<></>}
          <input name='email' value={formData.email} onChange={changehandler} type="email" placeholder='your email' />
          <input name='password' value={formData.password} onChange={changehandler}  type="password" placeholder='enter your password' />
        </div>
        <button onClick={()=>{state==='Login'?login():signup()}}>continue</button>

   {state==="sign-up"
   ?<p className='loginsignup-login'> Already have an account <span onClick={()=>{setstate('Login')}}> Login here</span></p>:<p className='loginsignup-login'>  Create an account <span onClick={()=>{setstate('sign-up')}}> click here</span> </p>}
        
        
        <div className='loginsignup-agree'>
          <input type="chechbox" name='' id='' />
          <p> By continuing , i agree to the terms of privacy policy</p>
        </div>
      </div>
  </div>
  )
}
