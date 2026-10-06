import React, { useEffect, useState } from "react";
import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import {
    createJob,
    getJobById,
    updateJob,
} from "../services/api";

import { useAuth } from "../context/AuthContext";

const PostJob = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const editId = searchParams.get("edit");
    const isEditMode = Boolean(editId);

    const [title, setTitle] = useState("");
    const [company, setCompany] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [requirements, setRequirements] = useState("");
    const [salary, setSalary] = useState("");
    const [jobType, setJobType] = useState("Full-Time");

    const [pageLoading, setPageLoading] = useState(
        isEditMode
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =================================================
    // LOAD JOB FOR EDIT
    // =================================================

    useEffect(() => {
        const loadJob = async () => {
            if (!editId) {
                setPageLoading(false);
                return;
            }

            try {
                setPageLoading(true);
                setError("");

                const data = await getJobById(editId);

                const job = data.job || data;

                setTitle(job.title || "");
                setCompany(job.company || "");
                setLocation(job.location || "");
                setDescription(job.description || "");
                setRequirements(job.requirements || "");
                setSalary(job.salary || "");
                setJobType(
                    job.jobType || "Full-Time"
                );

            } catch (error) {
                console.error(error);
                setError(
                    error.message ||
                    "Failed to load job."
                );
            } finally {
                setPageLoading(false);
            }
        };

        loadJob();
    }, [editId]);

    // =================================================
    // SUBMIT
    // =================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!user || !token) {
            setError("Please login first.");
            return;
        }

        try {
            setLoading(true);

            const jobData = {
                title,
                company,
                location,
                description,
                requirements,
                salary: Number(salary),
                jobType,
            };

            if (isEditMode) {
                await updateJob(
                    editId,
                    jobData,
                    token
                );

                setSuccess(
                    "Job updated successfully! 🎉"
                );
            } else {
                await createJob(
                    jobData,
                    token
                );

                setSuccess(
                    "Job posted successfully! 🎉"
                );

                // Clear form only when creating
                setTitle("");
                setCompany("");
                setLocation("");
                setDescription("");
                setRequirements("");
                setSalary("");
                setJobType("Full-Time");
            }

            setTimeout(() => {
                navigate("/dashboard");
            }, 1200);

        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // =================================================
    // PAGE LOADING
    // =================================================

    if (pageLoading) {
        return (
            <main className="modern-post-job-page">

                <div className="post-job-loading">

                    <div className="loading-spinner"></div>

                    <p>
                        Loading job details...
                    </p>

                </div>

            </main>
        );
    }

    // =================================================
    // PAGE
    // =================================================

    return (
        <main className="modern-post-job-page">

            <div className="modern-post-job-container">

                {/* ================= HEADER ================= */}

                <div className="modern-post-job-heading">

                    <div>

                        <span className="section-label">
                            RECRUITER
                        </span>

                        <h1>
                            {isEditMode
                                ? "Edit Job"
                                : "Post a New Job"}
                            <span> 💼</span>
                        </h1>

                        <p>
                            {isEditMode
                                ? "Update your job information and keep your listing up to date."
                                : "Find the right candidate for your company."}
                        </p>

                    </div>

                    <button
                        type="button"
                        className="post-job-back-btn"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ← Dashboard
                    </button>

                </div>

                {/* ================= FORM CARD ================= */}

                <div className="modern-post-job-card">

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

                    <form onSubmit={handleSubmit}>

                        {/* ================= BASIC INFO ================= */}

                        <div className="post-job-section-heading">

                            <div className="post-job-section-icon">
                                💼
                            </div>

                            <div>
                                <h2>
                                    Job Information
                                </h2>

                                <p>
                                    Enter the basic details
                                    about the position.
                                </p>
                            </div>

                        </div>

                        <div className="modern-post-job-grid">

                            {/* JOB TITLE */}

                            <div className="form-group">

                                <label htmlFor="title">
                                    Job Title
                                </label>

                                <input
                                    id="title"
                                    type="text"
                                    placeholder="e.g. Frontend Developer"
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                            {/* COMPANY */}

                            <div className="form-group">

                                <label htmlFor="company">
                                    Company
                                </label>

                                <input
                                    id="company"
                                    type="text"
                                    placeholder="Company name"
                                    value={company}
                                    onChange={(e) =>
                                        setCompany(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                            {/* LOCATION */}

                            <div className="form-group">

                                <label htmlFor="location">
                                    Location
                                </label>

                                <input
                                    id="location"
                                    type="text"
                                    placeholder="e.g. Bhubaneswar"
                                    value={location}
                                    onChange={(e) =>
                                        setLocation(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                            {/* SALARY */}

                            <div className="form-group">

                                <label htmlFor="salary">
                                    Salary
                                </label>

                                <input
                                    id="salary"
                                    type="number"
                                    placeholder="e.g. 50000"
                                    min="0"
                                    value={salary}
                                    onChange={(e) =>
                                        setSalary(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                            {/* JOB TYPE */}

                            <div className="form-group">

                                <label htmlFor="jobType">
                                    Job Type
                                </label>

                                <select
                                    id="jobType"
                                    value={jobType}
                                    onChange={(e) =>
                                        setJobType(
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="Full-Time">
                                        Full-Time
                                    </option>

                                    <option value="Part-Time">
                                        Part-Time
                                    </option>

                                    <option value="Internship">
                                        Internship
                                    </option>

                                    <option value="Contract">
                                        Contract
                                    </option>
                                </select>

                            </div>

                        </div>

                        {/* ================= DESCRIPTION ================= */}

                        <div className="post-job-text-section">

                            <div className="post-job-section-heading">

                                <div className="post-job-section-icon">
                                    📝
                                </div>

                                <div>
                                    <h2>
                                        Job Description
                                    </h2>

                                    <p>
                                        Explain the role and
                                        responsibilities.
                                    </p>
                                </div>

                            </div>

                            <div className="form-group">

                                <textarea
                                    id="description"
                                    rows="7"
                                    placeholder="Describe the job, responsibilities and day-to-day work..."
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                        </div>

                        {/* ================= REQUIREMENTS ================= */}

                        <div className="post-job-text-section">

                            <div className="post-job-section-heading">

                                <div className="post-job-section-icon">
                                    📋
                                </div>

                                <div>
                                    <h2>
                                        Requirements
                                    </h2>

                                    <p>
                                        List the required
                                        skills and qualifications.
                                    </p>

                                </div>

                            </div>

                            <div className="form-group">

                                <textarea
                                    id="requirements"
                                    rows="7"
                                    placeholder="e.g. React.js, JavaScript, HTML, CSS..."
                                    value={requirements}
                                    onChange={(e) =>
                                        setRequirements(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                        </div>

                        {/* ================= BUTTONS ================= */}

                        <div className="post-job-form-actions">

                            <button
                                type="button"
                                className="post-job-cancel-btn"
                                onClick={() =>
                                    navigate("/dashboard")
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="post-job-submit-btn"
                                disabled={loading}
                            >
                                {loading
                                    ? isEditMode
                                        ? "Updating..."
                                        : "Posting..."
                                    : isEditMode
                                        ? "Update Job ✏️"
                                        : "Post Job 🚀"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </main>
    );
};

export default PostJob;