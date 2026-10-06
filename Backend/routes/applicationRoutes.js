const express = require("express");

const {
    applyForJob,
    getMyApplications,
    getApplicationsForJob,
    updateApplicationStatus,
} = require("../controllers/applicationController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const uploadResume = require("../middleware/uploadMiddleware");

const router = express.Router();

// ================= APPLY FOR JOB =================

router.post(
    "/",
    protect,
    authorizeRoles("candidate"),
    uploadResume.single("resume"),
    applyForJob
);

// ================= CANDIDATE APPLICATIONS =================

router.get(
    "/my",
    protect,
    authorizeRoles("candidate"),
    getMyApplications
);

// ================= RECRUITER APPLICATIONS =================

router.get(
    "/job/:jobId",
    protect,
    authorizeRoles("recruiter"),
    getApplicationsForJob
);

// ================= UPDATE APPLICATION STATUS =================

router.put(
    "/:applicationId/status",
    protect,
    authorizeRoles("recruiter"),
    updateApplicationStatus
);

module.exports = router;