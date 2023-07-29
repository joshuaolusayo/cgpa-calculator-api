import Environment from '../config/env';
import jwt from 'jsonwebtoken';
const bcrypt = require('bcryptjs');

const validate_email = (raw_email: string) => {
  const email = raw_email.trim().toLowerCase();
  if (email.length < 6) {
    return {
      is_valid: false,
      message: 'Email address is too short.'
    };
  }

  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const is_valid = email_pattern.test(email);

  return {
    is_valid,
    message: is_valid ? email : 'Invalid email address.'
  };
};

export const check_password_match = async (
  plain_password: string,
  encrypted_password: string
) => {
  return await bcrypt.compare(plain_password, encrypted_password);
};

export const generate_token = (_id: string, email: string) => {
  const token = jwt.sign(
    { email, _id },
    Environment.JWT_SECRET,
    // issuer: ""
    {
      expiresIn: '90d'
    }
  );
  console.log({ token });
  return token;
};
