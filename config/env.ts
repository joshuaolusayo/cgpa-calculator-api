import throwIfUndefined from "./throwIfUndefined";
import "dotenv/config";

const Environment = {
  MONGO_URI: throwIfUndefined("Mongo uri", process.env.MONGO_URI),
  PORT: process.env.PORT || "5000",
  IP: process.env.IP || "0.0.0.0",
  JWT_SECRET: throwIfUndefined("JWT Secret", process.env.JWT_SECRET),
};

export default Environment;
