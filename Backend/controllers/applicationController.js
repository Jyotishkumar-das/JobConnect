const Application = require("../models/Application");
const Job = require("../models/Job");

// ==========================================
// APPLY FOR JOB
// ==========================================
const applyForJob = async (req, res) => {
    try {
        const { jobId, resume, coverLetter } = req.body;

        // Check Job ID
        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required",
            });
        }

        // Check whether job exists
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        // Check duplicate application
        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: req.user.userId,
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job",
            });
        }

        // Create application
        const application = await Application.create({
            job: jobId,
            applicant: req.user.userId,
            resume: resume || "",
            coverLetter: coverLetter || "",
        });

        res.status(201).json({
            message: "Application submitted successfully",
            application,
        });

    } catch (error) {
        console.error("Application Error:", error.message);

        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


// ==========================================
// GET MY APPLICATIONS
// ==========================================
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({
            applicant: req.user.userId,
        })
            .populate(
                "job",
                "title company location salary jobType"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: applications.length,
            applications,
        });

    } catch (error) {
        console.error("Get Applications Error:", error.message);

        res.status(500).json({
            message: "Failed to get applications",
            error: error.message,
        });
    }
};


// ==========================================
// GET APPLICATIONS FOR A JOB
// ==========================================
const getApplicationsForJob = async (req, res) => {
    try {
        const { jobId } = req.params;

        // Check whether job exists
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        // Check job ownership
        if (job.postedBy.toString() !== req.user.userId) {
            return res.status(403).json({
                message:
                    "You can only view applications for your own jobs",
            });
        }

        // Get applications for this job
        const applications = await Application.find({
            job: jobId,
        })
            .populate("applicant", "name email")
            .populate(
                "job",
                "title company location salary jobType"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: applications.length,
            applications,
        });

    } catch (error) {
        console.error(
            "Get Job Applications Error:",
            error.message
        );

        res.status(500).json({
            message: "Failed to get job applications",
            error: error.message,
        });
    }
};


// ==========================================
// UPDATE APPLICATION STATUS
// ==========================================
const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;

        // Check valid status
        if (!["pending", "accepted", "rejected"].includes(status)) {
            return res.status(400).json({
                message: "Invalid application status",
            });
        }

        // Find application
        const application = await Application.findById(applicationId);

        if (!application) {
            return res.status(404).json({
                message: "Application not found",
            });
        }

        // Find the job related to application
        const job = await Job.findById(application.job);

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        // Check job ownership
        if (job.postedBy.toString() !== req.user.userId) {
            return res.status(403).json({
                message:
                    "You can only manage applications for your own jobs",
            });
        }

        // Update application status
        application.status = status;

        await application.save();

        res.status(200).json({
            message: "Application status updated successfully",
            application,
        });

    } catch (error) {
        console.error(
            "Update Application Status Error:",
            error.message
        );

        res.status(500).json({
            message: "Failed to update application status",
            error: error.message,
        });
    }
};


// ==========================================
// EXPORT
// ==========================================
module.exports = {
    applyForJob,
    getMyApplications,
    getApplicationsForJob,
    updateApplicationStatus,
};