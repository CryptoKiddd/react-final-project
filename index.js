const express = require ('express');
const mongoose = require ('mongoose');
const dotenv = require('dotenv');
const cors = require('cors')




const app = express();
dotenv.config()


const userRoute = require('./routes/user')
const authRoute = require('./routes/auth')
const productRoute = require('./routes/product')
const cartRoute = require('./routes/cart')
const orderRoute = require('./routes/order')

mongoose.connect(process.env.MONGO_URL)
.then(console.log('db connected'))
.catch(err=>console.log('error connecting', err  ))


app.use(express.json())

app.use(cors())
app.use('/api/users', userRoute)
app.use('/api/auth', authRoute )
app.use('/api/products', productRoute)
app.use('/api/cart', cartRoute)
app.use('/api/orders', orderRoute)



app.listen(process.env.PORT || 5000, ()=>{
    console.log(`server is on ${process.env.PORT} `)
    
})