const express = require("express")
const mongoose = require("mongoose")
const User = require("./user")
const Book = require("./book")

const reviewSchema = new mongoose.Schema({
    reviewText:{
        type:String,
        required : true,
    },
    rating:{
        type:Number,
        required : true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true,
    },
    book:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required : false,
    },
    
})

const Review = mongoose.model("Review",reviewSchema)
module.exports = Review