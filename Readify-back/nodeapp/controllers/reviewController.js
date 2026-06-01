const Review = require("../models/review")

const addReview = async (req, res) => {
    try {

        const review = await Review.create(req.body)
        res.status(201).json({ message: "Review Added Successfully", review });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

const getReviewsByBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        // Find reviews for this book and populate user info (to show who wrote it)
        const reviews = await Review.find({ book: bookId }).populate('user', 'username');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .sort({ createdAt: -1 })
            .populate('user', 'username email mobileNumber mobile')
            // Add author, price, and coverImage here
            .populate('book', 'title author price coverImage stockQuantity');

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getReviewsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const reviews = await Review.find({ user: userId }).populate('book', 'title coverImage price category');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: 'Review Deleted Successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

module.exports = { addReview, deleteReview, getReviewsByBook, getReviewsByUser, getAllReviews }