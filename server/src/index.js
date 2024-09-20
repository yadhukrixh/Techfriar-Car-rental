import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// configure dotenv
dotenv.config();

// configure app
const app = express();

app.use(express.json());

// configure cors
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Allow requests from frontend
    methods: "GET, PUT, POST, DELETE",
    credentials: true, // Allow credentials (cookies, headers)
  })
);

app.get('/', (req, res) => {
  res.send("Backend");
});

// configure app port
const PORT = process.env.PORT || 3400; // Default port if not set
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
