const jwt = require("jsonwebtoken");

const AuthMiddleware = (req, res, next) => {

    try {

        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token required"
            });
        }

        const actualToken = token.split(" ")[1];

        const decoded = jwt.verify(
            actualToken,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (err) {

        res.status(401).json({
            success: false,
            message: "Invalid token"
        });

    }
};

module.exports = AuthMiddleware;