const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    try {
        // 1. Get token from header (common pattern)
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Attach user info to request
        req.user = decoded;

        // 4. Move to next route handler
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token invalid or expired" });
    }
}

module.exports = authMiddleware;
