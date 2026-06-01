const User = require("../models/user")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs');
const Book = require("../models/book");     
const Order = require("../models/order");  
const Review = require("../models/review");

const addUser = async (req, res, next) => {
    try {
        const { username, email, mobileNumber, password, userRole } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            mobileNumber,
            password: hashedPassword, 
            userRole
        });
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserByEmailAndPassword = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "Invalid inputs" })
        }
        const user = await User.findOne({ email })
        console.log(user, "user found");
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        req.user = user;
        next();

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ userRole: 'user' }).select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const [userCount, bookCount, orderCount, reviewCount] = await Promise.all([
            User.countDocuments({ userRole: 'user' }),
            Book.countDocuments(),
            Order.countDocuments(),
            Review.countDocuments()
        ]);

        res.status(200).json({
            users: userCount,
            books: bookCount,
            orders: orderCount,
            reviews: reviewCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





module.exports = { getUserByEmailAndPassword, addUser ,getDashboardStats,getAllUsers}