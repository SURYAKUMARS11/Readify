require("dotenv").config()
const express = require("express")
// const { writeDataToFileUsingFileSystem, readDataAndPrintUsingFileSystem } = require("./Week4day5")
const cors = require('cors');
const { mongoose } = require("mongoose")
const cookieParser = require("cookie-parser")
const app = express()
const PORT = 8080
const path = require('path');
app.use(cors());
app.use(express.json())
app.use(cookieParser())

const bookRoutes_fs = require("./routes/bookRoutes_fs")
const bookRoutes = require("./routes/bookRoutes")
const orderRoutes = require("./routes/orderRoutes")
const userRoutes_fs = require("./routes/userRoutes_fs")
const userRoutes = require("./routes/userRoutes")
const reviewRoutes = require("./routes/reviewRoutes")
// const { addData, displayData, writeDataToFile, readDataAndPrint } = require("./Week4Day3&4")


app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);

app.use("/api/user_fs", userRoutes_fs);
app.use("/api/books_fs", bookRoutes_fs)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get("/", (req, res) => {
    // addData({ username: "GuestUser", email: "guest@example.com" });
    // displayData();
    // writeDataToFile();
    // readDataAndPrint();

    // writeDataToFileUsingFileSystem();
    // readDataAndPrintUsingFileSystem()
    res.status(200).json("Welcome to Node js")
})

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect(process.env.DB_URL)
        console.log("Mongo DB is connected");
    } catch (error) {
        console.log("Connection error:", error);
    }
}

connectDB()

app.listen(PORT, () => {
    console.log("Server is running in 8080");
})