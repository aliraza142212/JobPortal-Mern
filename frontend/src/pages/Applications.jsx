import { useEffect, useState } from "react";

function Applications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchApplications = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/applications"
            );

            const data = await response.json();
            setApplications(data);
        } catch (error) {
            console.error("Error fetching applications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/applications/${id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ status })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Failed to update status");
                return;
            }

            alert(`Application ${status.toLowerCase()} successfully`);

            fetchApplications();
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Something went wrong");
        }
    };

    return (
        <div className="applications-page">
            <div className="applications-header">
                <span>APPLICATIONS</span>
                <h1>Job Applications</h1>
                <p>Review and manage submitted applications.</p>
            </div>

            {loading ? (
                <p>Loading applications...</p>
            ) : applications.length === 0 ? (
                <div className="no-applications">
                    <h2>No Applications Yet</h2>
                    <p>No one has applied for a job yet.</p>
                </div>
            ) : (
                <div className="applications-grid">
                    {applications.map((application) => (
                        <div
                            className="application-card"
                            key={application._id}
                        >
                            <div className="application-top">
                                <div className="applicant-icon">
                                    {application.name?.charAt(0).toUpperCase()}
                                </div>

                                <span className="application-status">
                                    {application.status}
                                </span>
                            </div>

                            <h2>{application.name}</h2>

                            <h3>
                                {application.job?.title || "Job"}
                            </h3>

                            <p>
                                <strong>Company:</strong>{" "}
                                {application.job?.company || "N/A"}
                            </p>

                            <p>
                                <strong>Email:</strong> {application.email}
                            </p>

                            <p>
                                <strong>Phone:</strong> {application.phone}
                            </p>

                            <div className="cover-message">
                                <strong>Cover Message</strong>
                                <p>{application.coverMessage}</p>
                            </div>

                            {application.status === "Pending" && (
                                <div className="application-actions">
                                    <button
                                        className="accept-button"
                                        onClick={() =>
                                            updateStatus(
                                                application._id,
                                                "Accepted"
                                            )
                                        }
                                    >
                                        Accept
                                    </button>

                                    <button
                                        className="reject-button"
                                        onClick={() =>
                                            updateStatus(
                                                application._id,
                                                "Rejected"
                                            )
                                        }
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Applications;