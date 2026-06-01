const express = require("express")
const { updateBook, addBook, getAllBooks, getBookById, deleteBook } = require("../controllers/bookController")
const { validateToken } = require("../middleware/auth")
const multer = require('multer');
const path = require('path');

const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure this folder exists in your backend root
    },
    filename: (req, file, cb) => {
        // Create a unique filename: timestamp + original extension
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


// Public route: Anyone can see the books
router.get("/getAllBooks", getAllBooks)

// Protected routes: Only logged-in Admins should perform these
router.post('/addBook', validateToken, upload.single('coverImage'), addBook);

// These routes need :id so req.params.id works in your controller
router.get("/getBookById/:id", validateToken, getBookById)
router.put('/updateBook/:id',validateToken, upload.single('coverImage'), updateBook);
router.delete("/deleteBook/:id", validateToken, deleteBook) // Added :id

module.exports = router