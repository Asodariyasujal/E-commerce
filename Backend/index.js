const port=4000;
const express = require('express');
const app = express();
const mongoose = require ('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { error } = require('console');
const { ftruncate } = require('fs');

app.use(express.json());
app.use(cors());

 // CONNECTION TO OUR WEB PAGE
// mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')
mongoose.connect("mongodb+srv://sujalasodariya03:sujal1234@cluster0.ehc8y1g.mongodb.net/ecommerce")


//API CREATION
app.get('/', (req,resp)=>{
    resp.send("express app is running");
})

// IMAGE STORAGE ENGINE
const storage = multer.diskStorage({
    destination:'./upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage});

app.use('/images', express.static('upload/images'));

app.post('/upload', upload.single('product'), (req,resp)=>{
    resp.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
});

//Schema for create product

const Product= mongoose.model("product",{
    id:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,

    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:String,
        required:true,

    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true
    }

})

app.post('/addproduct', async (req,resp)=>{

     let products= await Product.find({});
     let id;
     if(products.length>0){
        let last_product_array=products.slice(-1);
        let last_product=last_product_array[0];
        id=last_product.id+1;
     }else{
        id=1;
     }
          const product =new Product({
            id:id,
            name:req.body.name,
            image:req.body.image,
            category:req.body.category,
            new_price:req.body.new_price,
            old_price:req.body.old_price
          });
          console.log(product);
          await product.save();
          console.log("saved");
          resp.json({
            success:true,
            name:req.body.name,
          })
})

// CREATION DELETE API
app.post('/removeproduct',async (req,resp)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    resp.json({
        success:true,
        name:req.body.name
    })
})

// CREATE API FOR GETTING ALL PRODUCTS

app.get('/allprodcuts', async(req,resp)=>{
    let products= await Product.find({});
    console.log("All prodcuts fatched");
    resp.send(products);
})


// schema create for user model
const User = mongoose.model('users',{
 name:{
    type:String,
 },
 email:{
    type:String,
    unique:true,

 },
 password:{
    type:String,
 },
 cartData:{
    type:Object,
 },
 date:{
    type:Date,
    default:Date.now,
 }
})

// creating endpoints for registering the user

app.post('/signup', async(req,resp)=>{
      let check= await User.findOne({email:req.body.email});
      if(check){
        return resp.status(400).json({success:false,errors:"exosting user found with same  email address"})
      }
      let cart ={};
      for (let i = 0; i < 300; i++) {
        cart[i]=0;
        
      }
      const user= new User({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
      })
      await user.save();

      const data = {
         user:{
            id:user.id
         }
      }

      const token = jwt.sign(data,'secret_ecom');
      resp.json({success:true, token})

})

 // create endpoint for user login
 
 app.post('/login', async (req,res)=>{
    let user = await User.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password===user.password;
        if(passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true, token});
        }
        else{
            res.json({success:false,errors:"wrong password"});
        }
    }
    else{
        res.json({success:false, errors:"wrong email id"})
    }
 })


 // create a endpoint newcollection data points
 app.get('/newcollectiond', async (req,res)=>{
     let prodcuts =await Product.find({});
     let newcollection = prodcuts.slice(1).slice(-8);
     console.log("newcollection fetched")
     res.send(newcollection);
 })

 // create endpoint for popular in women


 app.get('/popularinwomen', async (req,res)=>{
    let products = await Product.find({category:'women'});
    let popular_in_women= products.slice(0,4);
    console.log("popular in women fetched")
    res.send(popular_in_women);
 })
 
// creating middelware to fetch user

 const fetchuser = async (req,resp,next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({errors:"please authenticate using validation"})
    }
    else{
        try {
            const data= jwt.verify(token,'secret_ecom');
            req.user=data.user;
            next();
        } catch (error) {
            res.status(401).send({errors:"please authenticate a valid token"})
        }
    }
 }

 
 // create endpointsfor  popular in cart data
 app.post('/addtocart', fetchuser,async (req,resp)=>{
    //  console.log(req.body, req.user);
    console.log("added", req.body.itemId);
    let userData = await User.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] +=1;
    await User.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});

  resp.send("added");

 })

 //creating endpoint to remove product from cartdata
 app.post('/removefromcart' , fetchuser, async (req,res)=>{
    console.log("removed", req.body.itemId);
    let userData = await User.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -=1;
    await User.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("remove");
 })

// create endpoint cartdata

app.post('/getcart',fetchuser,async(req,res)=>{
    console.log('getcart');
    let userData = await User.findOne({_id:req.user.id});
    res.json(userData.cartData);

})

app.listen(port,(error)=>{
    if(!error){
        console.log("server running on port" + port);
    }
    else{
        console.log("error:" +error);
    }
})