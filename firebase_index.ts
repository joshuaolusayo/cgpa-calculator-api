// import { Request, Response } from "express";
// import express from "express";
// import cors from "cors";
// import { collection, addDoc } from "firebase/firestore";
// import db from "./config/firebase";
// import { GenericController } from "./controllers/_";

// const app = express();

// const User = collection(db, "Users");
// const user_controller = new GenericController("User");

// app.use(express.json());
// app.use(cors());

// app.get("/", async (req: Request, res: Response) => {
//   try {
//     // const snapshot = await getD(User, data);
//     // res.json(snapshot);
//     const result = await user_controller.read_records();
//     console.log({ result });
//     res.json(result);
//   } catch (error) {
//     console.error("Error adding user:", error);
//     res.status(500).json({ error: "Failed to add user" });
//   }
// });

// app.post("/create", async (req: Request, res: Response) => {
//   const data = req.body;
//   console.log(data);

//   try {
//     await addDoc(User, data);
//     res.json({ message: "User added" });
//   } catch (error) {
//     console.error("Error adding user:", error);
//     res.status(500).json({ error: "Failed to add user" });
//   }
// });

// app.listen(5000, () => console.log("App running in PORT 5000"));
