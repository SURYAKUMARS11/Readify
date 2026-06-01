const jwt = require("jsonwebtoken");

const generateToken = (req, res, next) => {
    const user = req.user;

    const payloadData = {
        userId: user._id,
        role: user.userRole
    };

    const token = jwt.sign(payloadData, process.env.SECRET_KEY || "ajshdajkjbkasdjad", {
        expiresIn: '1d'
    });

    res.status(200).json({
        message: "Success",
        username: user.username,
        role: user.userRole,
        token: token,
        id: user._id
    });
};

const validateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY || "ajshdajkjbkasdjad");
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

module.exports = { generateToken, validateToken };