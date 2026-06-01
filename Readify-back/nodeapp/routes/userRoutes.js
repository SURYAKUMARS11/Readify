const express = require("express")
const { addUser, getUserByEmailAndPassword, getAllUsers, getDashboardStats } = require("../controllers/userController")
const {generateToken, validateToken} = require("../middleware/auth")
const router = express.Router()

router.post("/signup",addUser,generateToken)
router.post("/login",getUserByEmailAndPassword,generateToken)


router.get("/all", validateToken, getAllUsers);
router.get("/stats", validateToken, getDashboardStats);


module.exports = router

