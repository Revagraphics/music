import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Admin authentication required.",
      });
    }

    // Get token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Check admin role
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    // Store admin information in request
    req.admin = decoded;

    next();

  } catch (error) {
    console.error("Admin Auth Error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired admin token.",
    });
  }
};

export default adminAuth;