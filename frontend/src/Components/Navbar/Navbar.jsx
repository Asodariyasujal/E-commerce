import React, { useContext, useRef } from 'react'
import { useState } from 'react'
import './Navbar.css'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'
import new_dropdown from '../Assets/new_dropdown.png'

  export const Navbar = () => {

    const [menu,setmenu]=useState("shop");
    const {getTotalCartItems}= useContext(ShopContext);
    const menuRef=useRef();

    const dropdown_toggle=(e)=>{
      menuRef.current.classList.toggle('nav-menu-visible');
      e.target.classList.toggle('open');
    }

   return(
    
    <div className ='navbar'>
    <div className='nav-logo'>
      <img src={logo} alt="" />
       <p>shopper</p>
    </div>
    <img  className='nav-dropdown' onClick={dropdown_toggle} src={new_dropdown} alt="" />
    <ul ref={menuRef} className='nav-menu'>
      <li onClick={()=>{setmenu("shop")}}>    <Link style={{textDecoration:'none'}} to='/'>shop</Link>    {menu==="shop"?<hr/>:<></>} </li>
      <li onClick={()=>{setmenu("mens")}}>     <Link style={{textDecoration:'none'}} to='/mens'>men</Link>   {menu==="mens"?<hr/>:<></>}</li>
      <li onClick={()=>{setmenu("womens")}}>  <Link style={{textDecoration:'none'}} to='womens'>women</Link>   {menu==="womens"?<hr/>:<></>}</li>
      <li onClick={()=>{setmenu("kids")}}>    <Link style={{textDecoration:'none'}} to='kids'>kid</Link>    {menu==="kids"?<hr/>:<></>}</li>
    </ul>
    <div className='nav-login-cart'>
      {localStorage.getItem('auth-token')
      ? <button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace('/')}}> Log out</button>
    :<Link to='loginsignup'><button>Login</button></Link> }


      
    <Link to='cart'>  <img src={cart_icon} alt="" /></Link>
      <div className='nav-cart-count'>{getTotalCartItems()}</div>
    </div>

   </div>
    
   )
}
