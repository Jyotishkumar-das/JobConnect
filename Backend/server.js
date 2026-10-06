const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// ================= STATIC UPLOADS =================
// This allows uploaded PDF resumes to be opened in browser
app.use("/uploads", express.static("uploads"));

// ================= HOME ROUTE =================

app.get("/", (req, res) => {
    res.send("JobConnect Backend Server is Running 🚀");
});

// ================= AUTH ROUTES =================

app.use("/api/auth", authRoutes);

// ================= JOB ROUTES =================

app.use("/api/jobs", jobRoutes);

// ================= APPLICATION ROUTES =================

app.use("/api/applications", applicationRoutes);

// ================= SERVER =================

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";
const startServer = async () => {
    try {
        await connectDB();

        const server = app.listen(PORT, HOST, () => {
            console.log(
                `Server running on http://${HOST}:${PORT}`
            );
        });

        server.on("error", (error) => {
            console.error("Server Error ❌");
            console.error(error);
        });

    } catch (error) {
        console.error("Startup Error ❌");
        console.error(error.message);
        process.exit(1);
    }
};

startServer();