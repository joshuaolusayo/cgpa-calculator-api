const jwt = require("jsonwebtoken");

const generateToken = ({ userId, organizationId, email, role }) => {
  return jwt.sign(
    { userId, organizationId, email, role },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

module.exports = generateToken;
