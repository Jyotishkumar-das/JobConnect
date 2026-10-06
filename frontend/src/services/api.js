const API_URL = "http://127.0.0.1:5000/api";

// ==========================================
// LOGIN USER
// ==========================================

export const loginUser = async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Login failed");
    }

    return data;
};

// ==========================================
// REGISTER USER
// ==========================================

export const registerUser = async (
    name,
    email,
    password,
    role
) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            email,
            password,
            role,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Registration failed"
        );
    }

    return data;
};

// ==========================================
// GET ALL JOBS
// ==========================================

export const getAllJobs = async () => {
    const response = await fetch(`${API_URL}/jobs`);

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to get jobs"
        );
    }

    return data;
};

// ==========================================
// GET JOB BY ID
// ==========================================

export const getJobById = async (id) => {
    const response = await fetch(
        `${API_URL}/jobs/${id}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to get job"
        );
    }

    return data;
};

// ==========================================
// APPLY FOR JOB
// ==========================================

export const applyForJob = async (
    jobId,
    resumeFile,
    coverLetter,
    token
) => {
    // Create FormData for file upload
    const formData = new FormData();

    formData.append("jobId", jobId);
    formData.append("resume", resumeFile);
    formData.append("coverLetter", coverLetter);

    const response = await fetch(
        `${API_URL}/applications`,
        {
            method: "POST",

            headers: {
                // DO NOT add Content-Type here
                // Browser automatically sets multipart/form-data
                Authorization: `Bearer ${token}`,
            },

            body: formData,
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to apply for job"
        );
    }

    return data;
};

// ==========================================
// GET MY APPLICATIONS
// ==========================================

export const getMyApplications = async (token) => {
    const response = await fetch(
        `${API_URL}/applications/my`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to get applications"
        );
    }

    return data;
};

// ==========================================
// GET APPLICATIONS FOR A JOB
// ==========================================

export const getApplicationsForJob = async (
    jobId,
    token
) => {
    const response = await fetch(
        `${API_URL}/applications/job/${jobId}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to get applications"
        );
    }

    return data;
};

// ==========================================
// UPDATE APPLICATION STATUS
// ==========================================

export const updateApplicationStatus = async (
    applicationId,
    status,
    token
) => {
    const response = await fetch(
        `${API_URL}/applications/${applicationId}/status`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify({
                status,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to update application status"
        );
    }

    return data;
};

// ==========================================
// CREATE JOB
// ==========================================

export const createJob = async (
    jobData,
    token
) => {
    const response = await fetch(
        `${API_URL}/jobs`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify(jobData),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to create job"
        );
    }

    return data;
};

// ==========================================
// UPDATE JOB
// ==========================================

export const updateJob = async (
    jobId,
    jobData,
    token
) => {
    const response = await fetch(
        `${API_URL}/jobs/${jobId}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify(jobData),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to update job"
        );
    }

    return data;
};

// ==========================================
// DELETE JOB
// ==========================================

export const deleteJob = async (
    jobId,
    token
) => {
    const response = await fetch(
        `${API_URL}/jobs/${jobId}`,
        {
            method: "DELETE",

            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to delete job"
        );
    }

    return data;
};

// ==========================================
// UPDATE PROFILE
// ==========================================

export const updateProfile = async (
    name,
    token
) => {
    const response = await fetch(
        `${API_URL}/auth/profile`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify({
                name,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to update profile"
        );
    }

    return data;
};