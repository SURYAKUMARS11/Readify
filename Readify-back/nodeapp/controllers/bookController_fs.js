const fs = require("fs")
const path = require("path")
const dataPath = path.join(__dirname, "booksData.json")

exports.addBook_fs = (req, res) => {
    const newBook = req.body
    try {
        const rawData = fs.readFileSync(dataPath , "utf-8");
        let booksData = JSON.parse(rawData)

        const bookExists = booksData.some(book =>{
            book.title === newBook.title && book.author === newBook.author
        })

        if(bookExists){
            return res.status(500).json({
                error:true,
                message:"Book already exists",
                data: null
            })
        }
        const newBookWithId = {
            id:Data.now().toString(),
            title: newBook.title,
            author : newBook.author,
            description: newBook.description,
            price : newBook.price,
            stockQuantity : newBook.stockQuantity,
            category : newBook.category,
            coverimage : newBook.coverimage
        }

        booksData.push(newBookWithId)
        fs.writeFileSync(dataPath,JSON.stringify(booksData,null,2))
        res.status(200).json({
            error:false,
            message:"Book added successfully",
            data:newBookWithId
        })
    } catch (error) {
        return res.status("internal server error")
        
    }

}
exports.getAllBooks_fs = (req, res) => {
    try {
        const rawData = fs.readFileSync(dataPath,"utf8")
        const usersData = JOSN.parse(rawData)
        const userWithpassword = usersData.map(user=>{
            const {password , ...userWithpassword } = user;
            return userWithpassword;
        })

        res.status(200).json({
            message:"All user found successfully",
            data:userWithpassword
        })
    } catch (error) {
        return res.status(200).json({message : "Internal server error"})
    }
    
}
exports.getBookById_fs = (req, res) => {
    const bookId = parseInt(req.params.id)
    const dataPath = './booksData.json'

    try {
        const rawData = fs.readFileSync(dataPath,'utf8')
        const booksData = JSON.parse(rawData)
        const book = booksData.find(b=>b.id === bookId)

        if(book){
            res.status(200).json({
                error:false,
                message:"Book found successfully",
                data:book
            })
        }
        else{
            res.status(404).json({
                error:true,
                message:`No book found with ID ${bookId}`
            })
        }
    } catch (error) {
        res.status(500).json({
            error:true,
            message : "Internal server error"
        })
    }

}
exports.deleteBookById_fs = (req, res) => {
    const bookId = parseInt(req.params.id)
    const dataPath = './booksData.json'

    try {
        const rawData = fs.readFileSync(dataPath,'utf8')
        const booksData = JSON.parse(rawData)
        const bookIndex = booksData.findIndex(b=>b.id === bookId)

        if(bookIndex !== 1){
            const deleteBook = booksData.splice(bookIndex,1)
            fs.writeFileSync(dataPath,JSON.stringify(booksData,null,2))

            res.status(200).json({
                error:false,
                message:"Book Deleted successfully",
                data:deleteBook[0]
            })

        }
        else{
            res.status(404).json({
                error:true,
                message:`No book found with ID ${bookId}`
            })
        }
    } catch (error) {
        res.status(500).json({
            error:true,
            message : "Internal server error"
        })
    }
}
