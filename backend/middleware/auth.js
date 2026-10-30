import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: "Not authorized, please log in" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach user info to request
        req.user = { id: decoded.userId };
        next();
    } catch (err) {
        console.error("Auth middleware error:", err);
        return res.status(401).json({ error: "Not authorized, token invalid" });
    }
};
