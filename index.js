import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

const PORT = 8000;

app.use(express.json(), cors());
const uri = process.env.MONGODB_URI;

mongoose.connect(uri);

const db = mongoose.connection;
db.once("open", () => console.log("Connected to MongoDB"));

app.get("/", (req, res) => {
  res.send("YO!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
