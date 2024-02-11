import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'

const AddProduct = () => {
      
  const[image,setimage]=useState(false);
  const[productdetails,setproductdetails]=useState({
    name:"",
    image:"",
    category:"",
    old_price:"",
    new_price:""
  })

  const imagehandler=(e)=>{
     setimage(e.target.files[0])
  }
  const changehandler=(e)=>{
    setproductdetails({...productdetails,[e.target.name]:e.target.value})
  }
  const Add_product= async()=>{
    console.log(productdetails)
    let responseData;
    let product = productdetails;

    let formData = new FormData();
    formData.append('product', image);

    await fetch('http://localhost:4000/upload',{
      method:'POST',
      headers:{
        Accept:'application/json',
        
      },
      body:formData,

    }).then((resp)=>resp.json()).then((data)=>{responseData=data})
    
    if(responseData.success){
      product.image=responseData.image_url;
      console.log(product);
      await fetch('http://localhost:4000/addproduct',{
        method:'POST',
        headers:{
          Accept:'application/json',
          'content-type':'application/json'
        },
        body:JSON.stringify(product),


      }).then((resp)=>resp.json()).then((data)=>{
        data.success?alert("product added"):alert("failed")
      })
    }

        
  }

  return (
    <div className='addproduct'>
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input value={productdetails.name} onChange={changehandler} type="text" name='name' placeholder='Type here' />
      </div>
      <div className='addproduct-price'>
        <div className='addproduct-itemfield'>
          <p>price</p>
          <input value={productdetails.old_price} onChange={changehandler} type="text" name="old_price" placeholder='Type here'/>
        </div>
        <div className='addproduct-itemfield'>
          <p> offer price</p>
          <input value={productdetails.new_price} onChange={changehandler} type="text" name="new_price" placeholder='Type here'/>
        </div>
      </div>
      <div className='addproduct-itemfield'>
        <p>Product Category</p>
        <select value={productdetails.category} onChange={changehandler} name="category" className='add-product-selector'>
          <option value="women">Women</option>
          <option value="men">men</option>
          <option value="kid">kid</option>
        </select>
      </div>
      <div className='addproduct-itemfield'>
        <label htmlFor="file-input">
          <img src={image?URL.createObjectURL(image):upload_area}  className='addproduct-thumnail-img' alt="" />
        </label> 
          <input onChange={imagehandler}  type="file" name='iamge' id='file-input' hidden />
          
      </div>
      <button onClick={()=>
      {Add_product()}} className='addproduct-btn'>ADD

      </button>
    </div>
  )
}

export default AddProduct