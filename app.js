const express = require('express')
const path =require('path')
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const { title } = require('process');
const methodOverride = require('method-override')

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

//para ma parse an form makuwa an mga value
app.use(express.urlencoded({extended:true}))
//para magamit sa form an method na put,delete,patch
app.use(methodOverride('_method'))


// route
app.get('/',(req,res)=>{
    res.render('home')
})

//route para mag show tanan na campgrounds
app.get('/campgrounds',async(req,res)=>{
    const camps = await Campground.find({})
    res.render('campgrounds/index',{camps})  
})

//route para ig show an detail sa camp
//na gin pick
app.get('/campgrounds/:id',async(req,res)=>{
    const{id}=req.params
    const camp = await Campground.findById(id)
    res.render('campgrounds/camp',{camp})
})






app.listen(3000,()=>{
    console.log ("app running in port 3000")
})