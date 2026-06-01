const fs = require("fs")
const path = require("path")
const userFile_Path = path.join(__dirname,"..", "usersData.json")

function readUserData(callback) {

    if(!fs.existsSync(userFile_Path)){
        return callback(null,[]);
    }
    fs.access(userFile_Path, fs.constants.F_OK, (err) => {
        if (err) {
            return callback(null, []);
        }
        fs.readFile(userFile_Path, "utf8", (err, data) => {
            if (err) {
                return callback(null,[])
            }
            try {
                const user = data.trim() ? JSON.parse(data) : [];
                callback(null, user)
            } catch (error) {
                callback(null, [])
            }
        })
    })
}

function writeUsersData(users, callback) {
    const jsonString = JSON.stringify(users, null, 2)
    fs.writeFile(userFile_Path, jsonString, (err) => {
        if (err) {
            return callback(err)
        }
        callback(null)
    });
}

exports.register_fs = (req, res) => {
    console.log("register coming");
    const { id, username, email, mobileNumber, password, userRole } = req.body

    if (!email || !password) {
        return res.status(500).json({ error: true, messge: "Please provide email and password" })
    }

    readUserData((err, usersData) => {
        const emaiLExist = usersData.find(user => user.email === email)

        if (emaiLExist) {
            return res.status(400).json({ error: true, messge: "Email already exist" })
        }

        const newUser = {
            id, username, email, mobileNumber, password, userRole
        }

        usersData.push(newUser);

        writeUsersData(usersData, (err) => {
            return res.status(200).json({
                message: "User Registrations Successfull",
                data: usersData
            })
        })
    })
}


exports.login_fs = (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(500).json({ error: true, messge: "Please provide email and password" })
    }

    readUserData((err, usersData) => {
        const user = usersData.find(user => user.email === email)

        if (!user) {
            return res.status(400).json({ error: true, messge: "Invalid Credentials" })
        }
        const newUser = {
            id, username, email, mobileNumber, password, userRole
        }
        return res.status(200).json({
            message: "Login Successfull",
            data: { email: user.email }
        })

    })
}

exports.resetPassword_fs = (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(500).json({ error: true, messge: "Please provide email and password" })
    }
    try {
        const data = fs.readFileSync(userFile_Path, "utf8")
        const usersData =  JSON.parse(data)

        const userIndex = usersData.findIndex(user => user.email === email)

        if (userIndex === -1) {
            return res.status(400).json({ error: true, messge: "Email already exist" })
        }
        usersData[userIndex].password = password;
        fs.writeFileSync(userFile_Path, JSON.stringify(usersData,null,2))

        return res.status(200).json({
            message: "User Password has been updated successfully",
            data: { email: user.email }
        })
    } catch (error) {
         res.status(500).json({error: true,message: "error"})
    }
}

exports.getAllUsers_fs = (req, res) => {

}