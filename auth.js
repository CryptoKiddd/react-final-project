const router = require('express').Router();
const User = require ('../models/User');
const CryptoJs = require('crypto-js');
const jwt = require ('jsonwebtoken')

//register
router.post('/register', async(req,res)=>{

    const newUser = new User (
        {
            lastname: req.body.lastname,
            firstname: req.body.firstname,
            username: req.body.username,
            email: req.body.email,
            password: CryptoJs.AES.encrypt(req.body.password, process.env.PASS_SECRET_KEY).toString()
            
        }
    );
    try {
        const savedUser = await newUser.save()
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }

   

})

//login
router.post('/login', async(req,res )=>{

    try {
       

        const user = await User.findOne({username:req.body.username});
        !user && res.status(401 ).json('wrong username')

        const hashedPassword = CryptoJs.AES.decrypt(user.password, process.env.PASS_SECRET_KEY);
        const userPassword = hashedPassword.toString(CryptoJs.enc.Utf8);

        userPassword !== req.body.password &&  res.status(401).json('wrong password');

        const accessToken = jwt.sign({
            id: user._id, 
            isAdmin:user.isAdmin  
        }, 
        process.env.JWT_SECRET_KEY,
        {expiresIn:'3d'}
        )

      const { password , ...others } = await user._doc;
  
        res.status(200).json({...others, accessToken})
        
        
    } catch (error) {
        res.status(404).json(error)
    }


    
})




module.exports = router