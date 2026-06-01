const mongoose = require("mongoose");
const Book = require("../models/book");
const Order = require("../models/order");
const OrderItem = require("../models/orderItem");

const addOrder = async (req, res) => {
    try {
        const { orderItems, user, shippingAddress, billingAddress } = req.body;

        // 1. Basic Validation
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: "Order must contain at least one item." });
        }

        // 2. Create the Order instance (we save it later after calculating total)
        const order = new Order({
            user,
            orderItems: [],
            totalAmount: 0,
            orderStatus: "Pending",
            shippingAddress,
            billingAddress
        });

        let totalAmount = 0;
        const createdItemIds = [];

        // 3. Loop through items to validate and update stock
        for (const item of orderItems) {
            // Find book and check stock
            const book = await Book.findById(item.book);

            if (!book) {
                return res.status(404).json({ message: `Book not found: ${item.book}` });
            }

            if (book.stockQuantity < item.quantity) {
                return res.status(400).json({ 
                    message: `Insufficient stock for: ${book.title}. Available: ${book.stockQuantity}` 
                });
            }

            // Reduce stock and save book
            book.stockQuantity -= item.quantity;
            await book.save();

            // Create OrderItem
            const orderItem = new OrderItem({
                book: item.book,
                quantity: item.quantity,
                order: order._id
            });
            await orderItem.save();

            createdItemIds.push(orderItem._id);
            totalAmount += book.price * item.quantity;
        }

        // 4. Update order with final totals and save
        order.orderItems = createdItemIds;
        order.totalAmount = totalAmount;
        const savedOrder = await order.save();

        res.status(201).json({
            message: "Order placed successfully",
            order: savedOrder
        });

    } catch (error) {
        console.error("Order Error:", error);
        res.status(500).json({ message: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 }) 
            .populate('user') 
            .populate({
                path: 'orderItems', 
                populate: {
                    path: 'book', 
                    model: 'Book' 
                }
            });
            
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id, 
            { orderStatus: orderStatus }, 
            { new: true }
        );
        
        if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
        
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const orders = await Order.find({ user: userId })
      .populate({
        path: 'orderItems', // First, populate the OrderItem documents
        populate: {
          path: 'book',     // Second, inside each OrderItem, populate the Book details
          model: 'Book'
        }
      })
      .sort({ orderDate: -1 });
    
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};


const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('orderItems');
        if (!order) return res.status(404).json({ message: "Order not found" });

        for (const item of order.orderItems) {
            // Restore stock to the book
            const book = await Book.findById(item.book);
            if (book) {
                book.stockQuantity += item.quantity;
                await book.save();
            }
            // Delete the OrderItem
            await OrderItem.findByIdAndDelete(item._id);
        }

        // Delete the Order
        await Order.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Order Deleted & Stock Restored Successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllOrders, deleteOrder, addOrder ,updateOrderStatus,getOrdersByUser};
