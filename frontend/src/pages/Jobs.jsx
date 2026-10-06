import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllJobs } from "../services/api";

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState("");
    const [jobType, setJobType] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ================= GET ALL JOBS =================

    useEffect(() => {
        const loadJobs = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getAllJobs();

                console.log("Jobs API Response:", data);

                // Handle both:
                // 1. Direct array response
                // 2. Object response: { jobs: [...] }

                if (Array.isArray(data)) {
                    setJobs(data);
                } else if (Array.isArray(data.jobs)) {
                    setJobs(data.jobs);
                } else {
                    setJobs([]);
                    setError("Invalid jobs data received.");
                }

            } catch (error) {
                console.error("Failed to load jobs:", error);
                setError("Failed to load jobs.");
                setJobs([]);
            } finally {
                setLoading(false);
            }
        };

        loadJobs();
    }, []);

    // ================= SEARCH + FILTER =================

    const filteredJobs = jobs.filter((job) => {
        const searchText = search.toLowerCase().trim();

        const matchesSearch =
            job.title?.toLowerCase().includes(searchText) ||
            job.company?.toLowerCase().includes(searchText) ||
            job.location?.toLowerCase().includes(searchText);

        const matchesJobType =
            jobType === "All" ||
            job.jobType?.toLowerCase() ===
            jobType.toLowerCase();

        return matchesSearch && matchesJobType;
    });

    // ================= CLEAR FILTERS =================

    const clearFilters = () => {
        setSearch("");
        setJobType("All");
    };

    // ================= UI =================

    return (
        <main className="jobs-page-modern">

            {/* ================= HEADER ================= */}

            <section className="jobs-page-header">

                <div className="jobs-page-header-content">

                    <span className="section-label">
                        OPPORTUNITIES
                    </span>

                    <h1>
                        Find Your <span>Dream Job</span>
                    </h1>

                    <p>
                        Explore thousands of opportunities
                        and find the job that matches your
                        skills and career goals.
                    </p>

                </div>

            </section>

            {/* ================= SEARCH ================= */}

            <section className="jobs-search-section">

                <div className="jobs-search-container">

                    {/* SEARCH INPUT */}

                    <div className="jobs-search-box">

                        <span className="jobs-search-icon">
                            🔍
                        </span>

                        <input
                            type="text"
                            placeholder="Search jobs, companies or locations..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>

                    {/* JOB TYPE */}

                    <select
                        className="jobs-type-filter"
                        value={jobType}
                        onChange={(e) =>
                            setJobType(e.target.value)
                        }
                    >
                        <option value="All">
                            All Job Types
                        </option>

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

            </section>

            {/* ================= JOB LIST ================= */}

            <section className="jobs-list-section">

                <div className="jobs-list-container">

                    {/* ================= HEADING ================= */}

                    <div className="jobs-list-heading">

                        <div>

                            <span className="section-label">
                                AVAILABLE JOBS
                            </span>

                            <h2>
                                {filteredJobs.length} Jobs Found
                            </h2>

                        </div>

                        {(search || jobType !== "All") && (

                            <button
                                type="button"
                                className="clear-filter-btn"
                                onClick={clearFilters}
                            >
                                Clear Filters
                            </button>

                        )}

                    </div>

                    {/* ================= LOADING ================= */}

                    {loading && (

                        <div className="jobs-message">

                            <p>
                                Loading jobs...
                            </p>

                        </div>

                    )}

                    {/* ================= ERROR ================= */}

                    {!loading && error && (

                        <div className="jobs-message error">

                            <p>
                                {error}
                            </p>

                        </div>

                    )}

                    {/* ================= NO JOBS ================= */}

                    {!loading &&
                        !error &&
                        filteredJobs.length === 0 && (

                            <div className="jobs-message">

                                <div className="no-jobs-icon">
                                    🔍
                                </div>

                                <h3>
                                    No Jobs Found
                                </h3>

                                <p>
                                    Try changing your search
                                    or filter.
                                </p>

                                <button
                                    type="button"
                                    className="clear-filter-btn"
                                    onClick={clearFilters}
                                >
                                    Show All Jobs
                                </button>

                            </div>

                        )}

                    {/* ================= JOB CARDS ================= */}

                    {!loading &&
                        !error &&
                        filteredJobs.length > 0 && (

                            <div className="jobs-modern-grid">

                                {filteredJobs.map((job) => (

                                    <div
                                        className="job-modern-card"
                                        key={job._id}
                                    >

                                        {/* CARD TOP */}

                                        <div className="job-card-top">

                                            <div className="job-company-icon">

                                                {job.company
                                                    ?.charAt(0)
                                                    .toUpperCase()}

                                            </div>

                                            <span className="job-type-badge">
                                                {job.jobType}
                                            </span>

                                        </div>

                                        {/* JOB TITLE */}

                                        <h3>
                                            {job.title}
                                        </h3>

                                        {/* COMPANY */}

                                        <p className="job-company-name">
                                            {job.company}
                                        </p>

                                        {/* JOB INFO */}

                                        <div className="job-card-info">

                                            <span>
                                                📍 {job.location}
                                            </span>

                                            <span>
                                                💰 ₹{job.salary}
                                            </span>

                                        </div>

                                        {/* CARD FOOTER */}

                                        <div className="job-card-footer">

                                            <span className="job-card-date">
                                                Posted recently
                                            </span>

                                            <Link
                                                to={`/jobs/${job._id}`}
                                                className="job-details-btn"
                                            >
                                                View Details →
                                            </Link>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                </div>

            </section>

        </main>
    );
};

export default Jobs;