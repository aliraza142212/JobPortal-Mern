import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ApplyJob() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        coverMessage: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/api/applications", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    job: id,
                    ...formData
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Failed to submit application");
                return;
            }

            alert("Application submitted successfully!");

            setFormData({
                name: "",
                email: "",
                phone: "",
                coverMessage: ""
            });

            navigate("/jobs");
        } catch (error) {
            console.error("Error submitting application:", error);
            alert("Something went wrong");
        }
    };

    return (
        <div className="apply-page">
            <h1>Apply for Job</h1>

            <p>Complete the form below to submit your application.</p>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="coverMessage"
                    placeholder="Cover Message"
                    value={formData.coverMessage}
                    onChange={handleChange}
                    required
                ></textarea>

                <button type="submit">
                    Submit Application
                </button>
            </form>
        </div>
    );
}

export default ApplyJob;