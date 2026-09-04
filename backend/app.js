import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import songRoutes from "./routes/songRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// =====================================
// ENVIRONMENT VARIABLES
// =====================================

dotenv.config();

// =====================================
// EXPRESS APP
// =====================================

const app = express();

// =====================================
// __dirname FOR ES MODULES
// =====================================

const __filename = fileURLToPath(import.meta.url);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
const __dirname = path.dirname(__filename);


// =====================================
// MIDDLEWARE
// =====================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({
  extended: true,
}));


// =====================================
// STATIC UPLOADS
// =====================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// Keep existing files from the legacy singular upload directory available.
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "upload")
  )
);


// =====================================
// API ROUTES
// =====================================

app.use(
  "/api/songs",
  songRoutes
);

app.use("/api/admin", adminRoutes);


// =====================================
// HEALTH CHECK
// =====================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Music API is running",
  });
});


// =====================================
// 404 HANDLER
// =====================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


// =====================================
// ERROR HANDLER
// =====================================

app.use((err, req, res, next) => {

  console.error("Server Error:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});


export default app;