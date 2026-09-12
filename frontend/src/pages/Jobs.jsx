import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Jobs() {
    const location = useLocation();
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [allJobs, setAllJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All Jobs");

    const [formData, setFormData] = useState({
        title: "",
        company: "",
        location: "",
        description: "",
        salary: "",
        jobType: "Full Time",
        skills: ""
    });

    const searchResults = location.state?.searchResults;
    const searchPerformed = location.state?.searchPerformed;

    const categories = {
        "All Jobs": [],
        Technology: [
            "technology",
            "software",
            "developer",
            "development",
            "web",
            "it",
            "programming",
            "computer",
            "frontend",
            "backend",
            "full stack",
            "react",
            "node",
            "javascript"
        ],
        "Data & Analytics": [
            "data",
            "analytics",
            "analyst",
            "data science",
            "data scientist",
            "machine learning",
            "ai",
            "artificial intelligence",
            "business intelligence",
            "sql",
            "python"
        ],
        Design: [
            "design",
            "designer",
            "ui",
            "ux",
            "ui/ux",
            "graphic",
            "graphics",
            "visual",
            "figma",
            "creative"
        ],
        Marketing: [
            "marketing",
            "marketer",
            "digital marketing",
            "business",
            "seo",
            "social media",
            "content",
            "advertising",
            "sales",
            "brand"
        ]
    };

    const fetchJobs = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/jobs");
            const data = await response.json();

            setAllJobs(data);

            if (searchPerformed && searchResults) {
                setJobs(searchResults);
            } else {
                setJobs(data);
            }
        } catch (error) {
            console.error("Error fetching jobs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [searchPerformed]);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);

        if (category === "All Jobs") {
            setJobs(
                searchPerformed && searchResults
                    ? searchResults
                    : allJobs
            );
            return;
        }

        const keywords = categories[category];

        const filteredJobs = allJobs.filter((job) => {
            const searchableText = `
                ${job.title || ""}
                ${job.company || ""}
                ${job.description || ""}
                ${job.location || ""}
                ${(job.skills || []).join(" ")}
            `.toLowerCase();

            return keywords.some((keyword) =>
                searchableText.includes(keyword.toLowerCase())
            );
        });

        setJobs(filteredJobs);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/api/jobs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...formData,
                    skills: formData.skills
                        .split(",")
                        .map((skill) => skill.trim())
                        .filter(Boolean)
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Failed to post job");
                return;
            }

            alert("Job posted successfully!");

            setFormData({
                title: "",
                company: "",
                location: "",
                description: "",
                salary: "",
                jobType: "Full Time",
                skills: ""
            });

            await fetchJobs();
            setSelectedCategory("All Jobs");
        } catch (error) {
            console.error("Error posting job:", error);
            alert("Something went wrong");
        }
    };

    const clearSearch = () => {
        navigate("/jobs", { replace: true });
        setSelectedCategory("All Jobs");
    };

    return (
        <div className="jobs-page">
            <div className="jobs-header">
                <span>OPPORTUNITIES</span>

                <h1>
                    {searchPerformed
                        ? "Search Results"
                        : selectedCategory === "All Jobs"
                        ? "Find Your Next Job"
                        : selectedCategory}
                </h1>

                <p>
                    {searchPerformed
                        ? `${jobs.length} matching job${
                              jobs.length !== 1 ? "s" : ""
                          } found.`
                        : selectedCategory === "All Jobs"
                        ? "Explore the latest job opportunities and find your perfect role."
                        : `Explore ${selectedCategory.toLowerCase()} jobs and find your perfect opportunity.`}
                </p>

                {searchPerformed && (
                    <button
                        className="clear-search-button"
                        onClick={clearSearch}
                    >
                        Show All Jobs
                    </button>
                )}
            </div>

            {!searchPerformed && (
                <div className="job-categories">
                    <h2>Browse by Category</h2>

                    <div className="job-category-buttons">
                        {Object.keys(categories).map((category) => (
                            <button
                                key={category}
                                className={
                                    selectedCategory === category
                                        ? "active-category"
                                        : ""
                                }
                                onClick={() =>
                                    handleCategoryClick(category)
                                }
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {!searchPerformed && (
                <div className="post-job-section">
                    <h2>Post a Job</h2>

                    <form onSubmit={handleSubmit} className="job-form">
                        <input
                            type="text"
                            name="title"
                            placeholder="Job Title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="company"
                            placeholder="Company Name"
                            value={formData.company}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />

                        <textarea
                            name="description"
                            placeholder="Job Description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        ></textarea>

                        <input
                            type="text"
                            name="salary"
                            placeholder="Salary"
                            value={formData.salary}
                            onChange={handleChange}
                        />

                        <select
                            name="jobType"
                            value={formData.jobType}
                            onChange={handleChange}
                        >
                            <option value="Full Time">Full Time</option>
                            <option value="Part Time">Part Time</option>
                            <option value="Remote">Remote</option>
                            <option value="Internship">Internship</option>
                        </select>

                        <input
                            type="text"
                            name="skills"
                            placeholder="Skills (comma separated)"
                            value={formData.skills}
                            onChange={handleChange}
                        />

                        <button type="submit">Post Job</button>
                    </form>
                </div>
            )}

            <div className="available-jobs">
                <h2>
                    {searchPerformed
                        ? "Matching Jobs"
                        : selectedCategory === "All Jobs"
                        ? "Available Jobs"
                        : `${selectedCategory} Jobs`}
                </h2>

                {loading ? (
                    <p>Loading jobs...</p>
                ) : jobs.length === 0 ? (
                    <div className="no-jobs">
                        <h2>No Jobs Found</h2>

                        <p>
                            There are currently no jobs in this category.
                            Try another category or check all jobs.
                        </p>
                    </div>
                ) : (
                    <div className="jobs-grid">
                        {jobs.map((job) => (
                            <div
                                className="job-card"
                                key={job._id}
                            >
                                <div className="job-card-top">
                                    <div className="company-icon">
                                        {job.company
                                            ?.charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <span className="job-type">
                                        {job.jobType}
                                    </span>
                                </div>

                                <h3>{job.title}</h3>

                                <p className="company-name">
                                    {job.company}
                                </p>

                                <p className="job-location">
                                    📍 {job.location}
                                </p>

                                <p className="job-description">
                                    {job.description}
                                </p>

                                {job.salary && (
                                    <p className="job-salary">
                                        💰 {job.salary}
                                    </p>
                                )}

                                <div className="job-skills">
                                    {job.skills?.map((skill, index) => (
                                        <span key={index}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                <button
                                    className="apply-button"
                                    onClick={() =>
                                        navigate(`/apply/${job._id}`)
                                    }
                                >
                                    Apply Now
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Jobs;