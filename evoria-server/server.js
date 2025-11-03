import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import eventRoutes from "./routes/events.js";
import authRoutes from "./routes/auth.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
