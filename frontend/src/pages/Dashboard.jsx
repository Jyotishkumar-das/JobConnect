import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getAllJobs,
    getApplicationsForJob,
    updateApplicationStatus,
    deleteJob,
} from "../services/api";

import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ================= LOAD DASHBOARD =================

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const allJobs = await getAllJobs();

                const jobsArray = Array.isArray(allJobs)
                    ? allJobs
                    : allJobs.jobs || [];

                const recruiterJobs = jobsArray.filter(
                    (job) =>
                        job.postedBy?._id === user?.id ||
                        job.postedBy === user?.id
                );

                setJobs(recruiterJobs);

                let allApplications = [];

                for (const job of recruiterJobs) {
                    try {
                        const jobApplications =
                            await getApplicationsForJob(
                                job._id,
                                token
                            );

                        const applicationArray =
                            Array.isArray(jobApplications)
                                ? jobApplications
                                : jobApplications.applications || [];

                        allApplications = [
                            ...allApplications,
                            ...applicationArray,
                        ];
                    } catch (error) {
                        console.error(
                            `Failed to load applications for ${job.title}`,
                            error
                        );
                    }
                }

                setApplications(allApplications);

            } catch (error) {
                console.error(error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (user && token) {
            loadDashboard();
        }
    }, [user, token]);

    // ================= UPDATE APPLICATION =================

    const handleStatusUpdate = async (
        applicationId,
        status
    ) => {
        try {
            await updateApplicationStatus(
                applicationId,
                status,
                token
            );

            setApplications((prev) =>
                prev.map((application) =>
                    application._id === applicationId
                        ? {
                            ...application,
                            status,
                        }
                        : application
                )
            );

        } catch (error) {
            alert(error.message);
        }
    };

    // ================= DELETE JOB =================

    const handleDeleteJob = async (jobId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this job?"
        );

        if (!confirmed) return;

        try {
            await deleteJob(jobId, token);

            setJobs((prev) =>
                prev.filter(
                    (job) => job._id !== jobId
                )
            );

            setApplications((prev) =>
                prev.filter(
                    (application) =>
                        application.job?._id !== jobId &&
                        application.job !== jobId
                )
            );

        } catch (error) {
            alert(error.message);
        }
    };

    // ================= LOADING =================

    if (loading) {
        return (
            <main className="modern-dashboard">

                <div className="dashboard-loading">
                    <div className="loading-spinner"></div>

                    <p>
                        Loading Dashboard...
                    </p>
                </div>

            </main>
        );
    }

    // ================= STATS =================

    const totalJobs = jobs.length;

    const totalApplications =
        applications.length;

    const pendingApplications =
        applications.filter(
            (application) =>
                application.status === "pending"
        ).length;

    const acceptedApplications =
        applications.filter(
            (application) =>
                application.status === "accepted"
        ).length;

    const rejectedApplications =
        applications.filter(
            (application) =>
                application.status === "rejected"
        ).length;

    // ================= DASHBOARD =================

    return (
        <main className="modern-dashboard">

            <div className="dashboard-modern-container">

                {/* ================= HEADER ================= */}

                <section className="dashboard-modern-header">

                    <div>

                        <span className="section-label">
                            RECRUITER DASHBOARD
                        </span>

                        <h1>
                            Welcome back,{" "}
                            <span>{user?.name}</span>
                        </h1>

                        <p>
                            Manage your jobs and
                            candidate applications
                            from one place.
                        </p>

                    </div>

                    <button
                        type="button"
                        className="dashboard-post-job-btn"
                        onClick={() =>
                            navigate("/post-job")
                        }
                    >
                        + Post New Job
                    </button>

                </section>

                {/* ================= ERROR ================= */}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {/* ================= STATS ================= */}

                <section className="dashboard-modern-stats">

                    <div className="dashboard-stat">
                        <div className="dashboard-stat-icon">
                            💼
                        </div>

                        <div>
                            <span>Total Jobs</span>
                            <strong>{totalJobs}</strong>
                        </div>
                    </div>

                    <div className="dashboard-stat">
                        <div className="dashboard-stat-icon">
                            📄
                        </div>

                        <div>
                            <span>Applications</span>
                            <strong>
                                {totalApplications}
                            </strong>
                        </div>
                    </div>

                    <div className="dashboard-stat">
                        <div className="dashboard-stat-icon">
                            ⏳
                        </div>

                        <div>
                            <span>Pending</span>
                            <strong>
                                {pendingApplications}
                            </strong>
                        </div>
                    </div>

                    <div className="dashboard-stat">
                        <div className="dashboard-stat-icon">
                            ✅
                        </div>

                        <div>
                            <span>Accepted</span>
                            <strong>
                                {acceptedApplications}
                            </strong>
                        </div>
                    </div>

                    <div className="dashboard-stat">
                        <div className="dashboard-stat-icon">
                            ❌
                        </div>

                        <div>
                            <span>Rejected</span>
                            <strong>
                                {rejectedApplications}
                            </strong>
                        </div>
                    </div>

                </section>

                {/* ================= MY JOBS ================= */}

                <section className="dashboard-modern-section">

                    <div className="dashboard-section-heading">

                        <div>

                            <span className="section-label">
                                JOB MANAGEMENT
                            </span>

                            <h2>
                                My Jobs
                            </h2>

                            <p>
                                Jobs posted by you
                            </p>

                        </div>

                        <button
                            type="button"
                            className="dashboard-small-post-btn"
                            onClick={() =>
                                navigate("/post-job")
                            }
                        >
                            + Post Job
                        </button>

                    </div>

                    {jobs.length === 0 ? (

                        <div className="dashboard-modern-empty">

                            <div className="dashboard-empty-icon">
                                💼
                            </div>

                            <h3>
                                No Jobs Posted Yet
                            </h3>

                            <p>
                                Create your first job
                                posting to start receiving
                                applications.
                            </p>

                            <button
                                type="button"
                                className="dashboard-post-job-btn"
                                onClick={() =>
                                    navigate("/post-job")
                                }
                            >
                                Post a Job
                            </button>

                        </div>

                    ) : (

                        <div className="dashboard-modern-jobs">

                            {jobs.map((job) => {

                                const jobApplicationCount =
                                    applications.filter(
                                        (application) =>
                                            application.job?._id ===
                                            job._id ||
                                            application.job ===
                                            job._id
                                    ).length;

                                return (
                                    <div
                                        className="dashboard-modern-job-card"
                                        key={job._id}
                                    >

                                        <div className="dashboard-job-card-top">

                                            <div className="dashboard-company-icon">
                                                {job.company
                                                    ?.charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <span className="job-type-badge">
                                                {job.jobType}
                                            </span>

                                        </div>

                                        <h3>
                                            {job.title}
                                        </h3>

                                        <p className="dashboard-job-company">
                                            {job.company}
                                        </p>

                                        <div className="dashboard-job-info">

                                            <span>
                                                📍 {job.location}
                                            </span>

                                            <span>
                                                💰 ₹{job.salary}
                                            </span>

                                            <span>
                                                👥{" "}
                                                {jobApplicationCount}{" "}
                                                Applications
                                            </span>

                                        </div>

                                        <p className="dashboard-job-description">
                                            {job.description}
                                        </p>

                                        <div className="dashboard-job-actions">

                                            <button
                                                type="button"
                                                className="dashboard-edit-btn"
                                                onClick={() =>
                                                    navigate(
                                                        `/post-job?edit=${job._id}`
                                                    )
                                                }
                                            >
                                                ✏️ Edit
                                            </button>

                                            <button
                                                type="button"
                                                className="dashboard-delete-btn"
                                                onClick={() =>
                                                    handleDeleteJob(
                                                        job._id
                                                    )
                                                }
                                            >
                                                🗑️ Delete
                                            </button>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>
                    )}

                </section>

                {/* ================= APPLICATIONS ================= */}

                <section className="dashboard-modern-section">

                    <div className="dashboard-section-heading">

                        <div>

                            <span className="section-label">
                                CANDIDATES
                            </span>

                            <h2>
                                Applications
                            </h2>

                            <p>
                                Manage candidate applications
                            </p>

                        </div>

                    </div>

                    {applications.length === 0 ? (

                        <div className="dashboard-modern-empty">

                            <div className="dashboard-empty-icon">
                                📄
                            </div>

                            <h3>
                                No Applications Yet
                            </h3>

                            <p>
                                Applications from candidates
                                will appear here.
                            </p>

                        </div>

                    ) : (

                        <div className="dashboard-applications-list">

                            {applications.map(
                                (application) => {

                                    const job =
                                        application.job;

                                    const applicant =
                                        application.applicant;

                                    return (
                                        <div
                                            className="dashboard-modern-application"
                                            key={
                                                application._id
                                            }
                                        >

                                            <div className="dashboard-applicant">

                                                <div className="dashboard-applicant-avatar">
                                                    {applicant?.name
                                                        ?.charAt(0)
                                                        .toUpperCase() ||
                                                        "U"}
                                                </div>

                                                <div>

                                                    <h3>
                                                        {applicant?.name}
                                                    </h3>

                                                    <p>
                                                        {applicant?.email}
                                                    </p>

                                                    <p>
                                                        Applied for:{" "}
                                                        <strong>
                                                            {job?.title}
                                                        </strong>
                                                    </p>

                                                </div>

                                            </div>

                                            <div className="dashboard-application-right">

                                                <span
                                                    className={`application-status ${application.status}`}
                                                >
                                                    {
                                                        application.status
                                                    }
                                                </span>

                                                {application.resume && (
                                                    <a
                                                        href={`http://127.0.0.1:5000${application.resume}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="dashboard-resume-btn"
                                                    >
                                                        📄 View Resume
                                                    </a>
                                                )}

                                                <div className="dashboard-application-actions">

                                                    <button
                                                        type="button"
                                                        className="dashboard-accept-btn"
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                application._id,
                                                                "accepted"
                                                            )
                                                        }
                                                        disabled={
                                                            application.status ===
                                                            "accepted"
                                                        }
                                                    >
                                                        ✓ Accept
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="dashboard-reject-btn"
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                application._id,
                                                                "rejected"
                                                            )
                                                        }
                                                        disabled={
                                                            application.status ===
                                                            "rejected"
                                                        }
                                                    >
                                                        ✕ Reject
                                                    </button>

                                                </div>

                                            </div>

                                        </div>
                                    );
                                }
                            )}

                        </div>
                    )}

                </section>

            </div>

        </main>
    );
};

export default Dashboard;