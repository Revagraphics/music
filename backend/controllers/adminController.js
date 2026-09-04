import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required",
    });
  }

  if (!process.env.ADMIN_NAME || (!process.env.ADMIN_PASSWORD && !process.env.ADMIN_PASSWORD_HASH)) {
    return res.status(500).json({
      success: false,
      message: "Admin credentials are not configured on the server",
    });
  }

  const usernameMatches = username === process.env.ADMIN_NAME;
  const passwordMatches = process.env.ADMIN_PASSWORD_HASH
    ? await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH)
    : password === process.env.ADMIN_PASSWORD;

  if (!usernameMatches || !passwordMatches) {
    return res.status(401).json({
      success: false,
      message: "Invalid admin credentials",
    });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      success: false,
      message: "JWT_SECRET is not configured",
    });
  }

  const token = jwt.sign(
    { username, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  return res.json({ success: true, token });
};