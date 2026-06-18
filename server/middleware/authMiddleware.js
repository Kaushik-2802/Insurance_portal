import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {

    try {
        console.log("AUTH HEADERS:");
        console.log(req.headers.authorization);
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                msg: "No token provided"
            });
        }

        const token = authHeader.split(" ")[1];
        console.log("TOKEN:");
        console.log(token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("DECODED USER:");
        console.log(decoded);

        req.user = decoded;

        next();
    } catch (e) {
        console.log("JWT ERROR:");
        console.log(e);
        return res.status(401).json({msg: "Invalid or expired token"});
    }
};

export default authMiddleware;