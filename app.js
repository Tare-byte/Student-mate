//importing express module
const express= require('express');
//turning it to something usefool
const app= express();

//node mailer
const nodemailer = require('nodemailer')
const mymail= nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'basicprogramming7@gmail.com',
        pass: 'learnbig'
    }
});

//session
const sesseion = require('express-session');
// initializing my session
app.use(sesseion({secret:"taremicheals123", saveUninitialized:true, resave:true}))

const port = process.env.PORT || 3000

// requiring our database
const mongoose = require('mongoose');
//model
const item =require('./model/itm');
const userVerf = require('./model/userVerf');

// 
// mongodb+srv://tare:tester1@tareoooo.mefyl.mongodb.net/?retryWrites=true&w=majority
//connecting datbase
mongoose.connect("mongodb://127.0.0.1:27017/brrow",{useNewUrlParser:true,useUnifiedTopology:true}).then((result)=>{
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
    if (req.session.username) {
        res.render('verify', {msg:''})
    }else{
        res.status(404).render('404')
    }
    
})

app.post('/addItem',(req,res)=>{
    const collect=  req.body;
    const newItem = new item;
    if (req.session.username) {
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
    } else {
        res.status(404).render('404')
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
                    res.render('student',{id:data._id, msg:''})
                } else {
                    res.redirect('/store');
                }
            }
        })
    }else{
        res.redirect('/store')
    }
    
})

app.post('/item/buy/data/:id',(req,res)=>{
    const id = req.params.id.toString()
    const bdy= req.body
    const upl = req.files
    const sess= req.session
    // console.log(id);
    // if (sess.username=='MrsTare') {
        if (id.length==24) {
            item.findOne({_id: id},(err,data)=>{
                if (err) {
                    console.log(err);
                }else{
                    if (data) {
                        if (bdy.full_name && bdy.school_name && bdy.email_address && bdy.home_address && bdy.account_name ) {
                            upl.account_receipt.mv('./static/upload/'+bdy.full_name+bdy.account_name+bdy.product_id+'reciept'+upl.account_receipt.name)
                            upl.school_id.mv('./static/upload/'+bdy.full_name+bdy.account_name+bdy.product_id+'schoolid'+upl.school_id.name)
                            upl.national_id.mv('./static/upload/'+bdy.full_name+bdy.account_name+bdy.product_id+'nationalId'+upl.national_id.name)
                            const newbuy = new userVerf;
                            newbuy.fullname= bdy.full_name
                            newbuy.schoolname = bdy.school_name
                            newbuy.studentemailaddress = bdy.email_address
                            newbuy.Homeadress = bdy.home_address
                            newbuy.Accountname =bdy.account_name
                            newbuy.verified = false
                            newbuy.Productid = id
                            newbuy.School_id = '/static/upload/'+bdy.full_name+bdy.account_name+bdy.product_id+upl.school_id.name
                            newbuy.National_idcard ='/static/upload/'+bdy.full_name+bdy.account_name+bdy.product_id+upl.national_id.name
                            newbuy.Accountreciept ='/static/upload/'+bdy.full_name+bdy.account_name+bdy.product_id+upl.account_receipt.name
                            newbuy.save((err)=>{
                                if (err) {
                                    console.log(err);
                                } else {
                                    res.render('UploadedMsg')
                                }
                            })

                        }else{
                            res.render('student', {msg:'fill the complete form', id})
                        }
                    } else {
                        res.status(404).render('404')
                    }
                }
            })      
            
            
        }else{
            res.status(404).render('404');
        }
    
    
})

app.get('/loginadmin',(req,res)=>{
    // const sess= req.session
    res.render('login',{msg:''})
})

app.post('/loginadmin',(req,res)=>{
    const sess = req.session
    const input = req.body

    if (input.username=="MrsTare" && input.password=="tarePleaseLearnReactnativeOrNodeMongo") {
        sess.username= input.username
        res.render('admin')
    }else{
        res.render('login', {msg:'invalidLogin'})
    }
})


app.get('/itemslist',(req,res)=>{
    const sess = req.session.username
    if (sess == 'MrsTare') {
        userVerf.find({},(err,data)=>{
            if (err) {
                console.log(er);
            }else{
                if (data) {
                    const itemuser= data
                    // item.findOne({_id:itemuser})
                    // console.log(itemuser);
                    res.render('itemsList',{items: true, itemuser})
                }else{
                    res.render('itemsList',{items: false})
                }
            }
        })
    }else{
        res.status(404).render('404')
    }
})


app.get('/verify/:id',(req,res)=>{
    const sess = req.session.username;
    const id = req.params.id.toString();
    if (id.length == 24) {
        if (sess=='MrsTare'){
            userVerf.findOne({_id: id},(err,data)=>{
                if (err) {
                    console.log(err);
                } else {
                    if (data) {
                        console.log(data);
                        userVerf.updateOne({_id:data._id},{verified:true},(err)=>{
                            if (err) {
                                console.log(err);
                            }else{
                                mailto ={
                                    from:'basicprogramming7@gmail.com',
                                    to: data.studentemailaddress,
                                    subject: 'Placed Order',
                                    text: 'Your order has been verified and placed.\n according to our policy, you will have only 4 installment \n please make payment before then.\n Feel free to call 08139570069 \n Thank you'
                                }

                                async function sendmail() {
                                    await mymail.sendMail(mailto,(err,info)=>{
                                        if (err) {
                                            console.log(err);
                                        }else{
                                            console.log('email sent', info.response);
                                            res.send('mrs tare response sent')
                                        }
                                    })
                                }
                                sendmail()
                            }
                        })
                    } else {
                        res.status(404).render('404')
                    }
                }
            })
        }else{
            res.status(404).render('404')
        }
    }else{
        
    }
})

app.get('/reject/:id', (req,res)=>{
    const sess= req.session.username;
    const id = req.params.id.toString();

    if (id.length==24) {
        if (sess=='MrsTare') {
            userVerf.findOne({_id:id},(err,data)=>{
                if (err) {
                    console.log(err);
                } else {
                    if (data) {
                        userVerf.deleteOne({_id:id},(err)=>{
                            if (err) {
                                console.log(err);
                            } else {
                                const mailto= {
                                    from:'basicprogramming7@gmail.com',
                                    to: data.studentemailaddress,
                                    subject: 'Order Rejected',
                                    text:'Mr/Mrs.'+data.fullname+'\nYour oder of \n\nid: '+data._id+'\nFrom Accountname: ' + data.Accountname+'\n\nhas been rejected due to invalid form or wrong document or payment not recieved please do well to resend quality form or call 08139570069 for more info.\nThank you'
                                }

                                async function send() {
                                    await mymail.sendMail(mailto,(err,info)=>{
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            console.log("email sent ", info.response);
                                            res.send('Mrs Tare Item has been deleted and email sent thank you')
                                        }
                                    })
                                }
                                send()
                            }
                        })
                    }else{
                        res.status(404).render('404')
                    }
                }
            })
        } else {
            res.status(404).render('404')
        }
    }else{
        res.status(404).render('404')
    }
})

//view or get item
app.get('/static/upload/:item',(req,res)=>{
    const filess = req.params.item;
    res.sendFile(__dirname+'/static/upload/'+filess)
})




app.use((req,res)=>{
    res.status(404).render('404')
})