const express = require("express");
const mongoose = require("mongoose");
// Use the string name "User" instead of the variable to avoid circular dependencies
// const User = require("./user") 

const orderSchema = new mongoose.Schema({
    orderDate: {
        type: Date,
        default: Date.now,
        required: true,
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Accepted', 'Dispatched', 'Out for Delivery', 'Delivered'],
        default: 'Pending'
    },
    shippingAddress: {
        type: String,
        required: true,
    },
    billingAddress: {
        type: String,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Use the string name of your User model
        required: true,
    },
    // FIX: Define this as an array of ObjectIds referencing OrderItem
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
        required: true,
    }],
}, {
    timestamps: true
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;