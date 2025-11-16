// ✅ server.js (fix final)
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import eventRoutes from "./routes/events.js";
import authRoutes from "./routes/auth.js";
import attendanceRoutes from "./routes/attendance.js";
import registrationRoutes from "./routes/registration.js"; // pastikan path ini benar

const app = express();
app.use(cors());
app.use(bodyParser.json());

// DEBUG log
console.log("✅ Routes loaded:");
console.log(" - /api/events");
console.log(" - /api/auth");
console.log(" - /api/attendance");
console.log(" - /api/registration");

// ✅ daftar semua route
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/registration", registrationRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
