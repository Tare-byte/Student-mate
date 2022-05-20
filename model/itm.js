const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const item = new Schema({
    name:String,
    image:String,
    amount:Number,
    
});
const Item= mongoose.model("item",item);

module.exports= Item;