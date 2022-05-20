const mongoose = require('mongoose');
const { stringify } = require('nodemon/lib/utils');

const Schema = mongoose.Schema;

const UserItem = new Schema({
    Accountname:String,
    School_id:String,
    National_idcard:String,
    fullname:String,
    schoolname:String,
    Homeadress:String,
    Accountreciept:String,
    Productid:String,
    studentemailaddress:String,
    
});
const User_Item= mongoose.model("UserItem", UserItem);

module.exports= User_Item;