const Job = require("../models/Job");

// ================= CREATE JOB =================

const createJob = async (req, res) => {
    try {
        const {
            title,
            company,
            location,
            description,
            requirements,
            salary,
            jobType,
        } = req.body;

        // Check required fields
        if (
            !title ||
            !company ||
            !location ||
            !description ||
            !requirements ||
            !salary
        ) {
            return res.status(400).json({
                message: "Please provide all required job details",
            });
        }

        // Create job
        const job = await Job.create({
            title,
            company,
            location,
            description,
            requirements,
            salary,
            jobType,
            postedBy: req.user.userId,
        });

        res.status(201).json({
            message: "Job created successfully",
            job,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create job",
            error: error.message,
        });
    }
};

// ================= GET ALL JOBS =================

const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate("postedBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: jobs.length,
            jobs,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to get jobs",
            error: error.message,
        });
    }
};

// ================= GET SINGLE JOB =================

const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate("postedBy", "name email");

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        res.status(200).json({
            job,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to get job",
            error: error.message,
        });
    }
};

// ================= UPDATE JOB =================

const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        // Check if logged-in user posted this job
        if (job.postedBy.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You are not allowed to update this job",
            });
        }

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            message: "Job updated successfully",
            job: updatedJob,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update job",
            error: error.message,
        });
    }
};

// ================= DELETE JOB =================

const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        // Check if logged-in user posted this job
        if (job.postedBy.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You are not allowed to delete this job",
            });
        }

        await Job.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Job deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete job",
            error: error.message,
        });
    }
};

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
};