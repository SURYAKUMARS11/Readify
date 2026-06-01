const Book = require("../models/book")

const getAllBooks = async(req,res) =>{
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const getBookById = async (req,res) =>{
    try {
        const book = await Book.findById(req.params.id);
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const addBook = async (req, res) => {
    try {
        const bookData = { ...req.body };
        
        // If a file was uploaded, save the Cloudinary URL to the database
        if (req.file) {
            bookData.coverImage = req.file.path; // Cloudinary returns the full URL in path
        }

        const book = await Book.create(bookData);
        res.status(201).json({ message: "Book Added Successfully", book });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateBook = async (req, res) => {
    try {
        const updateData = { ...req.body };

        // If a new image was uploaded, update the path with Cloudinary URL
        if (req.file) {
            updateData.coverImage = req.file.path;
        }

        const book = await Book.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true, runValidators: true } 
        );

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ message: "Book Updated Successfully", book });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteBook = async (req,res) =>{
    try {
        const book = await Book.findByIdAndDelete(req.params.id)
        res.status(200).json({message:"Book Deleted Successfully"});
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

module.exports = {getAllBooks,getBookById,addBook,updateBook,deleteBook}

