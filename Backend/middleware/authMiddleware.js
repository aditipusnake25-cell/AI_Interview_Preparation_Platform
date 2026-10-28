import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required. Please log in."
      });
    }

    const token = authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token. Please log in again."
    });
  }
};

export default authMiddleware;