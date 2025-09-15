import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
    const isAutherHeader = req.headers.authorization;
    if (!isAutherHeader || !isAutherHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "unauthorized" })
    }
    const token = isAutherHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "invalid token" })
    }
}

export default isAuth;