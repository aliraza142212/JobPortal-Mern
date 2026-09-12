
import { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import "./index.css";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Jobs from "./pages/Jobs";
import ApplyJob from "./pages/ApplyJob";
import Applications from "./pages/Applications";
import Chatbot from "./components/Chatbot";

function Home() {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const [location, setLocation] = useState("");
    const [searchMessage, setSearchMessage] = useState("");

    const handleSearch = async () => {
        if (!keyword.trim() && !location.trim()) {
            setSearchMessage("Please enter a job title or location.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/jobs");
            const jobs = await response.json();

            const filteredJobs = jobs.filter((job) => {
                const keywordMatch =
                    !keyword.trim() ||
                    job.title?.toLowerCase().includes(keyword.toLowerCase()) ||
                    job.company?.toLowerCase().includes(keyword.toLowerCase()) ||
                    job.description?.toLowerCase().includes(keyword.toLowerCase()) ||
                    job.skills?.some((skill) =>
                        skill.toLowerCase().includes(keyword.toLowerCase())
                    );

                const locationMatch =
                    !location.trim() ||
                    job.location?.toLowerCase().includes(location.toLowerCase());

                return keywordMatch && locationMatch;
            });

            if (filteredJobs.length === 0) {
                setSearchMessage("No jobs found. Try another search.");
                return;
            }

            navigate("/jobs", {
                state: {
                    searchResults: filteredJobs,
                    searchPerformed: true
                }
            });
        } catch (error) {
            console.error("Search error:", error);
            setSearchMessage("Unable to search jobs right now.");
        }
    };

    const handleCategoryClick = (category) => {
        navigate("/jobs", {
            state: {
                category: category,
                categorySearch: true
            }
        });
    };

    return (
        <div className="home">
            <section className="hero">
                <div className="hero-content">
                    <span className="hero-tag">FIND YOUR DREAM JOB</span>

                    <h1>
                        Build Your Future.
                        <br />
                        <span>Find Your Dream Job.</span>
                    </h1>

                    <p>
                        Discover thousands of job opportunities and connect
                        with companies that are looking for talented people like you.
                    </p>

                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Job title, keyword or company"
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value);
                                setSearchMessage("");
                            }}
                        />

                        <input
                            type="text"
                            placeholder="Location"
                            value={location}
                            onChange={(e) => {
                                setLocation(e.target.value);
                                setSearchMessage("");
                            }}
                        />

                        <button onClick={handleSearch}>Search Jobs</button>
                    </div>

                    {searchMessage && (
                        <div className="search-message">
                            {searchMessage}
                        </div>
                    )}

                    <div className="popular">
                        <strong>Popular:</strong>
                        <span>Software Engineer</span>
                        <span>Web Developer</span>
                        <span>Data Analyst</span>
                    </div>
                </div>
            </section>

            <section className="categories">
                <div className="section-heading">
                    <span>EXPLORE OPPORTUNITIES</span>

                    <h2>Popular Job Categories</h2>

                    <p>
                        Find the right opportunity based on your skills and interests.
                    </p>
                </div>

                <div className="category-grid">
                    <div
                        className="category-card"
                        onClick={() => handleCategoryClick("Technology")}
                    >
                        <div className="category-icon">💻</div>

                        <h3>Technology</h3>

                        <p>Software, Web & IT Jobs</p>

                        <span>120+ Jobs</span>
                    </div>

                    <div
                        className="category-card"
                        onClick={() => handleCategoryClick("Data & Analytics")}
                    >
                        <div className="category-icon">📊</div>

                        <h3>Data & Analytics</h3>

                        <p>Data Science & Analysis</p>

                        <span>85+ Jobs</span>
                    </div>

                    <div
                        className="category-card"
                        onClick={() => handleCategoryClick("Design")}
                    >
                        <div className="category-icon">🎨</div>

                        <h3>Design</h3>

                        <p>UI/UX & Graphic Design</p>

                        <span>60+ Jobs</span>
                    </div>

                    <div
                        className="category-card"
                        onClick={() => handleCategoryClick("Marketing")}
                    >
                        <div className="category-icon">📈</div>

                        <h3>Marketing</h3>

                        <p>Digital & Business Marketing</p>

                        <span>70+ Jobs</span>
                    </div>
                </div>
            </section>

            <section className="why-us">
                <div className="why-content">
                    <span>WHY JOBPORTAL?</span>

                    <h2>Your Next Career Move Starts Here</h2>

                    <p>
                        We make job searching simple, fast and effective.
                        Find opportunities, apply easily and stay updated
                        with the latest hiring information.
                    </p>

                    <div className="features">
                        <div>
                            <strong>01</strong>
                            <h3>Find Jobs Easily</h3>
                            <p>Search and discover relevant opportunities.</p>
                        </div>

                        <div>
                            <strong>02</strong>
                            <h3>Easy Applications</h3>
                            <p>Apply to jobs with a simple process.</p>
                        </div>

                        <div>
                            <strong>03</strong>
                            <h3>Hiring Updates</h3>
                            <p>Get quick information about new openings.</p>
                        </div>
                    </div>
                </div>

                <div className="stats-card">
                    <div>
                        <strong>10K+</strong>
                        <span>Job Seekers</span>
                    </div>

                    <div>
                        <strong>2K+</strong>
                        <span>Companies</span>
                    </div>

                    <div>
                        <strong>5K+</strong>
                        <span>Active Jobs</span>
                    </div>

                    <div>
                        <strong>95%</strong>
                        <span>Success Rate</span>
                    </div>
                </div>
            </section>

            <section className="cta">
                <h2>Ready to Find Your Next Opportunity?</h2>

                <p>
                    Join JobPortal and take the next step in your career.
                </p>

                <div>
                    <Link to="/register">Create Account</Link>
                    <Link to="/jobs">Browse Jobs</Link>
                </div>
            </section>

            <footer>
                <div>
                    <h2>JobPortal</h2>

                    <p>
                        Connecting talented people with great opportunities.
                    </p>
                </div>

                <div>
                    <h4>Quick Links</h4>

                    <Link to="/">Home</Link>
                    <Link to="/jobs">Jobs</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </div>

                <div>
                    <h4>For Employers</h4>

                    <p>Post Jobs</p>
                    <p>Find Candidates</p>
                    <p>Manage Applications</p>
                </div>
            </footer>

            <div className="copyright">
                © 2026 JobPortal. All rights reserved.
            </div>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <nav className="navbar">
                <Link to="/" className="logo">
                    Job<span>Portal</span>
                </Link>

                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/jobs">Jobs</Link>
                    <Link to="/login">Login</Link>

                    <Link to="/register" className="nav-button">
                        Get Started
                    </Link>
                </div>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/apply/:id" element={<ApplyJob />} />
                <Route path="/applications" element={<Applications />} />
            </Routes>

            <Chatbot />
        </BrowserRouter>
    );
}

export default App;