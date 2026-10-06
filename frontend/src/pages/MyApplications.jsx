import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyApplications } from "../services/api";
import { useAuth } from "../context/AuthContext";

const MyApplications = () => {
    const { user, token } = useAuth();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ================= GET MY APPLICATIONS =================

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getMyApplications(token);

                setApplications(
                    Array.isArray(data)
                        ? data
                        : data.applications || []
                );
            } catch (error) {
                console.error(error);
                setError(error.message);
                setApplications([]);
            } finally {
                setLoading(false);
            }
        };

        if (user && token) {
            fetchApplications();
        }
    }, [user, token]);

    // ================= LOADING =================

    if (loading) {
        return (
            <main className="my-applications-modern">

                <div className="applications-loading">
                    <div className="loading-spinner"></div>

                    <p>
                        Loading your applications...
                    </p>
                </div>

            </main>
        );
    }

    return (
        <main className="my-applications-modern">

            {/* ================= HEADER ================= */}

            <section className="applications-page-header">

                <div className="applications-header-container">

                    <span className="section-label">
                        CANDIDATE DASHBOARD
                    </span>

                    <h1>
                        My <span>Applications</span>
                    </h1>

                    <p>
                        Track the jobs you have applied for
                        and check your application status.
                    </p>

                </div>

            </section>

            {/* ================= CONTENT ================= */}

            <section className="applications-content">

                <div className="applications-container">

                    {/* ================= ERROR ================= */}

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {/* ================= STATS ================= */}

                    <div className="applications-stat-card">

                        <div className="applications-stat-icon">
                            📋
                        </div>

                        <div>
                            <span>
                                Total Applications
                            </span>

                            <strong>
                                {applications.length}
                            </strong>
                        </div>

                    </div>

                    {/* ================= EMPTY ================= */}

                    {applications.length === 0 ? (

                        <div className="applications-empty">

                            <div className="applications-empty-icon">
                                📄
                            </div>

                            <h2>
                                No Applications Yet
                            </h2>

                            <p>
                                You haven't applied for any
                                jobs yet. Start exploring
                                opportunities today.
                            </p>

                            <Link
                                to="/jobs"
                                className="applications-browse-btn"
                            >
                                Browse Jobs →
                            </Link>

                        </div>

                    ) : (

                        /* ================= APPLICATION LIST ================= */

                        <div className="applications-modern-grid">

                            {applications.map(
                                (application) => (

                                    <div
                                        className="application-modern-card"
                                        key={application._id}
                                    >

                                        {/* ================= JOB HEADER ================= */}

                                        <div className="application-modern-header">

                                            <div className="application-company-icon">
                                                {application.job?.company
                                                    ?.charAt(0)
                                                    .toUpperCase() || "J"}
                                            </div>

                                            <div className="application-job-title">

                                                <h2>
                                                    {application.job?.title ||
                                                        "Job Title"}
                                                </h2>

                                                <p>
                                                    {application.job?.company ||
                                                        "Company"}
                                                </p>

                                            </div>

                                        </div>

                                        {/* ================= JOB INFO ================= */}

                                        <div className="application-modern-info">

                                            <div>
                                                <span>
                                                    📍
                                                </span>

                                                <p>
                                                    <small>
                                                        Location
                                                    </small>

                                                    <strong>
                                                        {application.job?.location ||
                                                            "Not specified"}
                                                    </strong>
                                                </p>
                                            </div>

                                            <div>
                                                <span>
                                                    💰
                                                </span>

                                                <p>
                                                    <small>
                                                        Salary
                                                    </small>

                                                    <strong>
                                                        ₹
                                                        {application.job?.salary ||
                                                            "Not specified"}
                                                    </strong>
                                                </p>
                                            </div>

                                            <div>
                                                <span>
                                                    💼
                                                </span>

                                                <p>
                                                    <small>
                                                        Job Type
                                                    </small>

                                                    <strong>
                                                        {application.job?.jobType ||
                                                            "Not specified"}
                                                    </strong>
                                                </p>
                                            </div>

                                        </div>

                                        {/* ================= COVER LETTER ================= */}

                                        <div className="application-cover-modern">

                                            <h3>
                                                Cover Letter
                                            </h3>

                                            <p>
                                                {application.coverLetter ||
                                                    "No cover letter provided."}
                                            </p>

                                        </div>

                                        {/* ================= ACTION ================= */}

                                        {application.resume && (
                                            <a
                                                href={`http://127.0.0.1:5000${application.resume}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="application-resume-btn"
                                            >
                                                📄 View Resume
                                            </a>
                                        )}

                                        {/* ================= FOOTER ================= */}

                                        <div className="application-modern-footer">

                                            <span>
                                                Applied on{" "}
                                                {new Date(
                                                    application.createdAt
                                                ).toLocaleDateString()}
                                            </span>

                                            <span
                                                className={`application-status ${application.status}`}
                                            >
                                                {application.status}
                                            </span>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </section>

        </main>
    );
};

export default MyApplications;