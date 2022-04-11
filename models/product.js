const mongo=require("mongoose");
module.exports=mongo.model("productdata",mongo.Schema({price:String}),'productdata')