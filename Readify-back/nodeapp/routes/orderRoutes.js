const express = require("express")
const { deleteOrder, getAllOrders, addOrder, updateOrderStatus, getOrdersByUser } = require("../controllers/orderController")
const Order = require("../models/order")
const orderItem = require("../models/orderItem")

const router = express.Router()

router.get("/getAllOrders",getAllOrders)
router.post("/addOrder",addOrder)
router.put('/updateStatus/:id', updateOrderStatus);
router.delete("/deleteOrder",deleteOrder)
router.get('/getOrdersByUser/:userId', getOrdersByUser);

router.delete('/deleteOrder/:id', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        // Optional: Also delete corresponding OrderItems if you are using a separate collection
        await orderItem.deleteMany({ order: req.params.id }); 
        res.status(200).json({ message: "Order deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

    
module.exports = router