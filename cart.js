
const {
    verifyToken,
    verifyTokenAuthorization,
    verifyTokenAdmin,
  } = require("./verifyToken");
  const CryptoJs = require("crypto-js");
  const Cart = require("../models/Cart");
  const router = require("express").Router();



  //Create

  router.post('/',verifyTokenAuthorization, async (req, res)=>{
    const newCart = new Cart(req.body);

    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart)
    } catch (error) {
        res.status(500).json(error)
        
    }

  })
  
  router.put("/:id", verifyToken, async (req, res) => {
  
    try {
      const updatedCart = await Cart.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedCart);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  router.delete("/:id", verifyTokenAuthorization, async (req, res) => {
    try {
      await Cart.findByIdAndDelete(req.params.id);
      res.status(200).json("Cart has been deleted");
    } catch (error) {
      res.status(500).json(err);
    }
  });
//   get user cart

  router.get("/find/:userId",verifyTokenAuthorization, async (req, res) => {
    try {
      const cart = await Cart.findOne({userId:req.params.userId});
     
  
      res.status(200).json(cart);
    } catch (error) {
      res.status(401).json("not found", err);
    }
  });
  
  //get all Carts
  router.get("/", verifyTokenAdmin, async (req, res) => {
   
    try {
        const carts =  await Cart.find()
   
  
      res.status(200).json(carts);
    } catch (error) {
      res.status(500).json( err);
    }
  });
  

  

  

module.exports = router