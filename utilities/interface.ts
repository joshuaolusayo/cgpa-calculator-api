import { Request } from "express";

interface CustomRequest extends Request {
  payload: any; // Replace 'any' with the appropriate type for your payload
  user: any; // Replace 'any' with the appropriate type for your payload
}

// interface CustomRequest extends Request {
//   payload: any; // Replace 'any' with the appropriate type for your payload
// }

export { CustomRequest };
