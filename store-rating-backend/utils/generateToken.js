const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role, name: user.name },
    SECRET,
    { expiresIn: "1h" }
  );
};

module.exports = generateToken;
