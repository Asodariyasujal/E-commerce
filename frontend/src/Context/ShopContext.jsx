import React, { createContext, useEffect, useState } from "react";
// import all_product from '../Components/Assets/all_product';
// import { Product } from "../Pages/Product";

export const  ShopContext= createContext(null);
const getDefaultCart=()=>{
    let cart={};                                             
    for (let index = 0; index <300+1; index++) {     // we can use in 300
        cart[index]=0;
        
    }
    return cart;
}

 const ShopContextProvider=(props)=>{

    const [all_product,setAll_product] =useState([]);
     const [cartItems,setCartItems]=useState(getDefaultCart());
    
     useEffect(()=>{
       fetch('http://localhost:4000/allprodcuts').then((resp)=>resp.json()).then((data)=>setAll_product(data))
            // if(localStorage.getItem('auth-token')){
            //     fetch('http://localhost:4000/getcart',{
            //         method:'POST',
            //         headers:{
            //             Accept:'application/form-data',
            //             'auth-token':`${localStorage.getItem('auth-token')}`,
            // //             'Content-type':'application/json',
            //         },
            // //         body:"",
            //     }).then((res)=>res.json()).then((data)=>setCartItems(data))
            // }
     },[])


    // console.log(cartItems);
    const addtoCart=(itemId)=>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        // console.log(cartItems);
        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/addtocart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'content-type':'application/json',
                },
                body:JSON.stringify({"itemId":itemId})
            }).then((resp)=>resp.json).then((data)=>console.log(data));
        }
    }

    const removetoCart=(itemId)=>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/removefromcart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'content-type':'application/json',
                },
                body:JSON.stringify({"itemId":itemId})
            }).then((resp)=>resp.json).then((data)=>console.log(data));
        }
    }

    const getTotalCartAmount = ()=>{
        let totalAmount=0;
        for(const item in cartItems){
            if(cartItems[item]>0)
            {
                let itemInfo =all_product.find((Product)=>Product.id===Number(item));
                totalAmount+= itemInfo.new_price*cartItems[item];
            }
        }
        return totalAmount;
    }

    const getTotalCartItems =()=>{
        let totalItem=0;
        for(const item in cartItems){
            if(cartItems[item]>0){
                totalItem+=cartItems[item];
            }

        }
        return totalItem;
    }

    const contextvalue={getTotalCartItems,getTotalCartAmount,all_product,cartItems,addtoCart,removetoCart};

    return(
        <ShopContext.Provider value={contextvalue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;