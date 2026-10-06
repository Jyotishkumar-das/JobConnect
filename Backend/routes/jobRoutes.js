const express = require("express");

const {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
} = require("../controllers/jobController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get all jobs
router.get("/", getAllJobs);

// Get single job
router.get("/:id", getJobById);

// Create job - protected
router.post("/", protect, createJob);

// Update job - protected
router.put("/:id", protect, updateJob);

// Delete job - protected
router.delete("/:id", protect, deleteJob);

module.exports = router;