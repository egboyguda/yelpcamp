const express = require('express')
const path =require('path')
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const { title } = require('process');
const methodOverride = require('method-override');
const { get } = require('http');
const ejsMate = require('ejs-mate')
const partials = require('express-partials')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const {campgroundSchema} = require('./schemas')
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
app.engine('ejs',ejsMate)

const validateCamp = (req,res,next)=>{
    const {error} =campgroundSchema.validate(req.body)
        if(error){
            const msg = error.details.map(e =>e.message).join(',')
            throw new ExpressError(msg,400)
        }else{
            next();
        }
}

// route
app.get('/',(req,res)=>{
    res.render('home')
})

//route para mag show tanan na campgrounds
app.get('/beaches',async(req,res)=>{
    const camps = await Campground.find({})
    res.render('campgrounds/index',{camps})  
})

//route para pag himu bag o na campground
app.get('/beaches/add',(req,res)=>{
    res.render('campgrounds/add')
})

//n dd may gmit na pan catch error sa async
//pag may error dd execute to app.use sa ubus
app.post('/beaches',validateCamp,catchAsync(async(req,res,next)=>{
        const camp =await new Campground(req.body)
        await camp.save()
        res.redirect('/beaches')
    }))
//n dd pag edit sa camp
app.get('/beaches/:id/edit',async(req,res)=>{
    const {id} = req.params
    const camp = await Campground.findById(id)
    res.render('campgrounds/edit',{camp})

})
app.put('/beaches/:id',validateCamp,catchAsync(async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndUpdate(id, req.body)
    res.redirect('/beaches')

}))

//dd an pag delete camp
app.get('/beaches/:id/delete',async(req,res)=>{
    const {id} = req.params
    const camp = await Campground.findById(id)
    res.render('campgrounds/delete',{camp})
})

app.delete('/beaches/:id',catchAsync(async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndRemove(id)
    res.redirect('/beaches')
}))


//route para ig show an detail sa camp
//na gin pick
app.get('/beaches/:id',async(req,res)=>{
    const{id}=req.params
    const camp = await Campground.findById(id)
    res.render('campgrounds/camp',{camp})
});

app.all('*',(req,res,next)=>{
    
    next(new ExpressError('Page not found',404))
})

app.use((err,req,res,next)=>{
    const {statusCode=500}=err;
    if(!err.message) err.message = 'oh no, something went wrong'
    res.status(statusCode).render('error',{err})
    //res.send("oh boy, something went wrong!")
})



app.listen(3000,()=>{
    console.log ("app running in port 3000")
})