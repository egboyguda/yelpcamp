const express = require('express')
const app = express()
const path =require('path')
const mongoose = require('mongoose');

//datebase connection
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('DATABASE IS CONNECTED')
});
//app.set
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))




app.get('/',(req,res)=>{
    res.render('home')
})





app.listen(3000,()=>{
    console.log ("app running in port 3000")
})