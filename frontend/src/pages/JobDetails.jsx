import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { getJobById, applyForJob } from "../services/api";
import { useAuth } from "../context/AuthContext";

const JobDetails = () => {
    const { id } = useParams();
    const { user, token } = useAuth();

    const [job, setJob] = useState(null);

    const [resume, setResume] = useState(null);
    const [coverLetter, setCoverLetter] = useState("");

    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ================= GET JOB DETAILS =================

    useEffect(() => {
        const fetchJob = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getJobById(id);

                setJob(data.job || data);
            } catch (error) {
                console.error(error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    // ================= RESUME =================

    const handleResumeChange = (e) => {
        const file = e.target.files[0];

        setError("");
        setSuccess("");

        if (!file) {
            setResume(null);
            return;
        }

        if (file.type !== "application/pdf") {
            setError("Only PDF files are allowed.");
            setResume(null);
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Resume PDF must be less than 5 MB.");
            setResume(null);
            return;
        }

        setResume(file);
    };

    // ================= APPLY =================

    const handleApply = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!user || !token) {
            setError("Please login to apply for this job.");
            return;
        }

        if (user.role !== "candidate") {
            setError("Only candidates can apply for jobs.");
            return;
        }

        if (!resume) {
            setError("Please select your resume PDF.");
            return;
        }

        try {
            setApplying(true);

            await applyForJob(
                id,
                resume,
                coverLetter,
                token
            );

            setSuccess(
                "Application submitted successfully! 🎉"
            );

            setResume(null);
            setCoverLetter("");

            const fileInput =
                document.getElementById("resume");

            if (fileInput) {
                fileInput.value = "";
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setApplying(false);
        }
    };

    // ================= LOADING =================

    if (loading) {
        return (
            <main className="job-details-page-modern">

                <div className="job-details-loading">
                    <div className="loading-spinner"></div>

                    <p>
                        Loading job details...
                    </p>
                </div>

            </main>
        );
    }

    // ================= NOT FOUND =================

    if (!job) {
        return (
            <main className="job-details-page-modern">

                <div className="job-details-empty">

                    <div className="empty-job-icon">
                        🔍
                    </div>

                    <h2>
                        Job Not Found
                    </h2>

                    <p>
                        The job you are looking for
                        does not exist.
                    </p>

                    <Link
                        to="/jobs"
                        className="job-back-btn"
                    >
                        ← Back to Jobs
                    </Link>

                </div>

            </main>
        );
    }

    return (
        <main className="job-details-page-modern">

            {/* ================= PAGE HEADER ================= */}

            <section className="job-details-top">

                <div className="job-details-top-container">

                    <Link
                        to="/jobs"
                        className="back-to-jobs"
                    >
                        ← Back to Jobs
                    </Link>

                    <div className="job-details-main-header">

                        <div className="job-details-company-icon">
                            {job.company
                                ?.charAt(0)
                                .toUpperCase()}
                        </div>

                        <div className="job-details-title">

                            <span className="section-label">
                                JOB OPPORTUNITY
                            </span>

                            <h1>
                                {job.title}
                            </h1>

                            <p>
                                🏢 {job.company}
                            </p>

                        </div>

                    </div>

                    <div className="job-details-meta">

                        <div className="job-meta-item">
                            <span>📍</span>
                            <div>
                                <small>Location</small>
                                <strong>
                                    {job.location}
                                </strong>
                            </div>
                        </div>

                        <div className="job-meta-item">
                            <span>💰</span>
                            <div>
                                <small>Salary</small>
                                <strong>
                                    ₹{job.salary}
                                </strong>
                            </div>
                        </div>

                        <div className="job-meta-item">
                            <span>💼</span>
                            <div>
                                <small>Job Type</small>
                                <strong>
                                    {job.jobType}
                                </strong>
                            </div>
                        </div>

                    </div>

                </div>

            </section>

            {/* ================= CONTENT ================= */}

            <section className="job-details-content">

                <div className="job-details-layout">

                    {/* ================= LEFT ================= */}

                    <div className="job-details-left">

                        <section className="job-content-card">

                            <div className="job-content-heading">

                                <span>
                                    📝
                                </span>

                                <h2>
                                    Job Description
                                </h2>

                            </div>

                            <p className="job-description-text">
                                {job.description}
                            </p>

                        </section>

                        <section className="job-content-card">

                            <div className="job-content-heading">

                                <span>
                                    📋
                                </span>

                                <h2>
                                    Requirements
                                </h2>

                            </div>

                            <p className="job-description-text">
                                {job.requirements}
                            </p>

                        </section>

                    </div>

                    {/* ================= RIGHT APPLY ================= */}

                    <div className="job-details-right">

                        {user?.role === "candidate" ? (

                            <section className="modern-apply-card">

                                <div className="apply-card-header">

                                    <span className="apply-label">
                                        APPLY NOW
                                    </span>

                                    <h2>
                                        Apply for this Job
                                    </h2>

                                    <p>
                                        Submit your resume
                                        and cover letter.
                                    </p>

                                </div>

                                {error && (
                                    <div className="error-message">
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="success-message">
                                        {success}
                                    </div>
                                )}

                                <form
                                    onSubmit={handleApply}
                                >

                                    {/* RESUME */}

                                    <div className="form-group">

                                        <label htmlFor="resume">
                                            Resume (PDF)
                                        </label>

                                        <div className="resume-upload-box">

                                            <input
                                                id="resume"
                                                type="file"
                                                accept=".pdf,application/pdf"
                                                onChange={
                                                    handleResumeChange
                                                }
                                                required
                                            />

                                            <span>
                                                📄 Choose PDF Resume
                                            </span>

                                            <small>
                                                Maximum file size:
                                                5 MB
                                            </small>

                                        </div>

                                        {resume && (
                                            <p className="selected-file">
                                                📄 {resume.name}
                                            </p>
                                        )}

                                    </div>

                                    {/* COVER LETTER */}

                                    <div className="form-group">

                                        <label htmlFor="coverLetter">
                                            Cover Letter
                                        </label>

                                        <textarea
                                            id="coverLetter"
                                            rows="7"
                                            placeholder="Write your cover letter..."
                                            value={coverLetter}
                                            onChange={(e) =>
                                                setCoverLetter(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>

                                    <button
                                        type="submit"
                                        className="apply-submit-btn"
                                        disabled={applying}
                                    >
                                        {applying
                                            ? "Submitting..."
                                            : "Apply Now 🚀"}
                                    </button>

                                </form>

                            </section>

                        ) : (

                            <section className="modern-apply-card login-apply-card">

                                <div className="apply-login-icon">
                                    🔐
                                </div>

                                <h2>
                                    Interested in this job?
                                </h2>

                                <p>
                                    Please login as a
                                    candidate to apply
                                    for this job.
                                </p>

                                <Link
                                    to="/login"
                                    className="apply-submit-btn"
                                >
                                    Login to Apply
                                </Link>

                            </section>

                        )}

                    </div>

                </div>

            </section>

        </main>
    );
};

export default JobDetails;