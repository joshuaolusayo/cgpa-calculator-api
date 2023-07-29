import { connect } from "mongoose";
import Environment from "./env";

const uri = Environment.MONGO_URI;

const connectDatabase = () => {
  connect(uri)
    .then(() => {
      console.info("connected");
      console.log("Connected to MongoDB");
      // Start your Express server or perform other operations
    })
    .catch((error) => {
      console.error(error);
      console.error("Failed to connect to MongoDB", error);
    });
};

export default connectDatabase;
