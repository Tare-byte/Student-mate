//importing express module
const express= require('express');
//turning it to something usefool
const app= express();


//session
const sesseion = require('express-session');
// initializing my session
app.use(sesseion({secret:"TheresaSoludoPrinceNsea", saveUninitialized:true, resave:true}))

const port = process.env.PORT || 3000

// requiring our database
const mongoose = require('mongoose');
//model
const item =require('./model/itm');
const userVerf = require('./model/userVerf');


//connecting datbase
mongoose.connect("mongodb://localhost:27017/borrow",{useNewUrlParser:true,useUnifiedTopology:true}).then((result)=>{
    if (result){
        console.log("Your database is connected");

        // when db is connected then load our server                
        // creating our server 
        app.listen(port,()=>{
            console.log("http://localhost:3000/");
        });
    }
}).catch((error)=>{
    console.log(error);
})

//requiring bodyparser to read json easily
const bodyParser= require('body-parser');
// const req = require('express/lib/request');
// setting body parser 
app.use(bodyParser.urlencoded({extended:true}));


// setting up our views engine
app.set("view engine","ejs");


//setting up static folder
app.use(express.static('static'))
// app.use(express.static(__dirname+'static/upload/'))

//cross origin resource sharing
const cors = require("cors")
app.use(cors())

//http logging request
const morgan = require('morgan')
app.use(morgan('dev'))

//required middleware
const_= require('lodash')

//accepting files
const fileupload = require('express-fileupload');
app.use(fileupload({createParentPath:true}))

//website link
const weblink ='http://localhost:3000'


app.get("/",(req,res)=>{
    res.render('index');
})

app.get('/store', (req,res)=>{
    item.find({},(err,data)=>{
        if (err) {
            console.log(err);
        } else {
            if (data) {
                // console.log(data);
                res.render('store',{item:true ,data, weblink})
            } else {
                res.render('store',{item:false})
            }
        }
    })
    // res.render('store')
})


app.get('/addItem',(req,res)=>{
    res.render('verify', {msg:''})
})

app.post('/addItem',(req,res)=>{
    const collect=  req.body;
    const newItem = new item;
    if (collect.full_name && collect.Amount) {
        if (req.files){
            const filess =req.files.filename;
            if(filess.mimetype=='image/jpeg'){
                const location ='static/upload/'+collect.full_name+collect.Amount+'.jpeg';
                filess.mv('./'+location)
                newItem.name= collect.full_name
                newItem.image ='/'+ location
                newItem.amount = collect.Amount
                newItem.save((err)=>{
                    if(err){
                        console.log(err);
                    }else{
                        res.redirect('/store')
                    }
                })
            }else if(filess.mimetype=='image/jpg'){
                const location ='static/upload/'+collect.full_name+collect.Amount+'.jpg';
                filess.mv('./static/upload/'+collect.full_name+collect.Amount+'.jpg')
                newItem.name= collect.full_name
                newItem.image ='/'+ location
                newItem.amount = collect.Amount
                newItem.save((err)=>{
                    if(err){
                        console.log(err);
                    }else{
                        res.redirect('/store')
                    }
                })
            }else if(filess.mimetype=='image/png'){
                const location ='static/upload/'+collect.full_name+collect.Amount+'.png';
                filess.mv('./static/upload/'+collect.full_name+collect.Amount+'.png')
                newItem.name= collect.full_name
                newItem.image ='/'+ location
                newItem.amount = collect.Amount
                newItem.save((err)=>{
                    if(err){
                        console.log(err);
                    }else{
                        res.redirect('/store')
                    }
                })
            }else{
                res.render('verify',{msg:'invalid filetype'})
            }
        }else{
            res.render('verify',{msg:'input file'})
        }     
    } else {
        res.render('verify',{msg:"fill the form"})
    }
})


app.get('/item/buy/data/:id',(req,res)=>{
    const id= req.params.id
    if(id.length==24){
        item.findOne({_id:id},(err,data)=>{
            if (err) {
                console.log(err);
            } else {
                if (data) {
                    res.render('student',{id:data._id})
                } else {
                    res.redirect('/store');
                }
            }
        })
    }else{
        res.redirect('/store')
    }
    item.findOne({_id:id},(err,data)=>{
        if (err) {
            console.log(err);
        } else {
            if (data) {
                res.render('student',{id:data._id})
            } else {
                res.redirect('/store');
            }
        }
    })
})


//view or get item
app.get('/static/upload/:item',(req,res)=>{
    const filess = req.params.item;
    res.sendFile(__dirname+'/static/upload/'+filess)
})