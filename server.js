import express from "express";
import { config } from "dotenv";
import RazorPay from "razorpay";
import cors from "cors";
import paymentRoute from "./routes/paymentRoute.js";
import mongoose from "mongoose";

config({ path: "./config/config.env" });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//db connection

const url = process.env.MONGO_ATLAS_URL;

const connectionParams = {
  useUnifiedTopology: true,
};
mongoose.set("strictQuery", true);
mongoose
  .connect(url, connectionParams)
  .then(() => {
    console.log("Connected to the database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. n${err}`);
  });

//api call

app.use("/api", paymentRoute);

app.get("/api/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
);

//razorpay required fiels
export const instance = new RazorPay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

app.listen(process.env.PORT, () =>
  console.log(`server is running on ${process.env.PORT}`)
);
