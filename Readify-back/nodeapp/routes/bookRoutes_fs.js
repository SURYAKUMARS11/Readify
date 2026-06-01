const express = require("express")
const { addBook_fs, getAllBooks_fs, getBookById_fs, deleteBookById_fs } = require("../controllers/bookController_fs")

const router = express.Router()

router.post("/addBook_fs",addBook_fs)
router.get("/getAllBooks_fs",getAllBooks_fs)
router.get("/getBookById_fs",getBookById_fs)
router.delete("/deleteBookById_fs",deleteBookById_fs)


module.exports = router