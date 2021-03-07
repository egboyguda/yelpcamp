const express = require('express')
const path =require('path')
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const { title } = require('process');

//datebase connection
mongoose.connect('mongodb://localhost/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('DATABASE IS CONNECTED')
});

//starting app
const app = express()

//app.set
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))



// route
app.get('/',(req,res)=>{
    res.render('home')
})

//route para maghimu campground
app.get('/makecampground',async(req,res)=>{
    const camp = await new Campground({title:'My backyard',description:'barato la na camp'})
    await camp.save();
    res.send(camp)
})





app.listen(3000,()=>{
    console.log ("app running in port 3000")
})