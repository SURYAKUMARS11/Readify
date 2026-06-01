const express = require("express")
const router = express.Router()
const userControllerFs = require("../controllers/userController_fs")

router.post("/registerFs",userControllerFs.register_fs)
router.post("/loginFs",userControllerFs.login_fs)
router.post("/resetPassword_fs",userControllerFs.resetPassword_fs)

module.exports = router