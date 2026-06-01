const express = require("express")
const { updateBook, addBook, getAllBooks, getBookById, deleteBook } = require("../controllers/bookController")
const { validateToken } = require("../middleware/auth")
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const router = express.Router()

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'readify_books', // Cloudinary folder name
        allowed_formats: ['jpg', 'png', 'jpeg'],
    },
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