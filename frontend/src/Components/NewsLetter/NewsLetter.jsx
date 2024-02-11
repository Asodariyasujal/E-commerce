import React from 'react'
import './NewsLetter.css'

export const NewsLetter = () => {
  return (
    <div className='newsletter'>
        
       <h1>GET EXCLUSIVE OFFERS ON YOUR EMAIL</h1>
          
       <p>Subscribe to our newletter and stay update </p>
       <div>
        <input type="email" placeholder='your email' />
        <button>Subscribe</button>
       </div>
      </div>
  )
}
