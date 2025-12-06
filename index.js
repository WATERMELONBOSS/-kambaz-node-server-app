import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import db from "./Kambaz/Database/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModulesRoutes from "./Kambaz/Modules/routes.js";
import AssignmentsRoutes from "./Kambaz/Assignments/routes.js";
import EnrollmentsRoutes from "./Kambaz/Enrollments/routes.js";
import cors from "cors";

const CONNECTION_STRING =
  process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";
mongoose.connect(CONNECTION_STRING);

const app = express();
// Configure CORS: allow the configured client URL in production,
// but reflect the request origin during development so local dev ports work.
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  // "http://localhost:3001",
].filter(Boolean);
const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    // allow non-browser requests like curl (no Origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // allow any localhost origin for developer convenience
    if (origin.startsWith("http://localhost")) return callback(null, true);
    // allow any Vercel preview deployment URL
    if (origin.includes("vercel.app")) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
};
app.use(cors(corsOptions));

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};
if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.SERVER_URL,
  };
}

app.use(session(sessionOptions));
app.use(express.json());

UserRoutes(app, db);
CourseRoutes(app, db);
ModulesRoutes(app, db);
AssignmentsRoutes(app, db);
EnrollmentsRoutes(app, db);
Lab5(app);
Hello(app);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
