const express = require("express")
const { addReview, deleteReview, getReviewsByBook, getReviewsByUser, getAllReviews } = require("../controllers/reviewController")

const router = express.Router()

router.post("/addReview",addReview)
router.delete("/deleteReview/:id", deleteReview);
router.get("/getReviewsByUser/:userId", getReviewsByUser);

router.get("/getReviewsByBook/:bookId", getReviewsByBook);

router.get("/getAllReviews", getAllReviews);

module.exports = router