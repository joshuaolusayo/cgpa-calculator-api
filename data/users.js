const bcrypt = require("bcryptjs");

const users = [
  {
    name: "Admin",
    email: "admin@example.com",
    password: bcrypt.hashSync("123456", 10),
    role: "admin",
    isVerified: true,
  },
  {
    name: "User",
    email: "user@example.com",
    password: bcrypt.hashSync("123456", 10),
    isVerified: true,
  },
];

module.exports = users;
