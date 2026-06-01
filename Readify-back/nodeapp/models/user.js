const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required : true,
        unique:true
    },
    email:{
        type:String,
        required : true,
        unique:true
    },
    mobileNumber:{
        type:Number,
        required : true,
    },
    password:{
        type:String,
        required : true,
    },
    userRole:{
        type:String,
        enum:["admin","user"],
        required : true,
    },
})

const User = mongoose.model("User",UserSchema)
module.exports = User