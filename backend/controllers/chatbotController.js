import Job from "../models/Job.js";

export const chatbot = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                message: "Please enter a message"
            });
        }

        const text = message.toLowerCase().trim();

        const jobs = await Job.find().sort({ createdAt: -1 });

        if (
            text.includes("what jobs") ||
            text.includes("available jobs") ||
            text.includes("current jobs") ||
            text.includes("hiring")
        ) {
            if (jobs.length === 0) {
                return res.json({
                    reply: "There are currently no jobs available."
                });
            }

            const jobList = jobs
                .slice(0, 5)
                .map(
                    (job) =>
                        `${job.title} at ${job.company} - ${job.location}`
                )
                .join("\n");

            return res.json({
                reply: `Here are the current job openings:\n\n${jobList}`
            });
        }

        if (text.includes("salary") || text.includes("pay")) {
            const salaryJobs = jobs.filter((job) => job.salary);

            if (salaryJobs.length === 0) {
                return res.json({
                    reply: "Salary information is not available."
                });
            }

            const result = salaryJobs
                .slice(0, 5)
                .map(
                    (job) =>
                        `${job.title} at ${job.company}: ${job.salary}`
                )
                .join("\n");

            return res.json({
                reply: `Here is the salary information:\n\n${result}`
            });
        }

        if (
            text.includes("remote") ||
            text.includes("internship") ||
            text.includes("part time") ||
            text.includes("full time")
        ) {
            let type = "Full Time";

            if (text.includes("remote")) {
                type = "Remote";
            } else if (text.includes("internship")) {
                type = "Internship";
            } else if (text.includes("part time")) {
                type = "Part Time";
            }

            const filteredJobs = jobs.filter(
                (job) => job.jobType === type
            );

            if (filteredJobs.length === 0) {
                return res.json({
                    reply: `No ${type} jobs are currently available.`
                });
            }

            const result = filteredJobs
                .slice(0, 5)
                .map(
                    (job) =>
                        `${job.title} at ${job.company} - ${job.location}`
                )
                .join("\n");

            return res.json({
                reply: `${type} jobs:\n\n${result}`
            });
        }

        const matchedJobs = jobs.filter((job) => {
            const searchableText = `
                ${job.title}
                ${job.company}
                ${job.location}
                ${job.description}
                ${job.skills?.join(" ")}
            `.toLowerCase();

            return searchableText.includes(text);
        });

        if (matchedJobs.length > 0) {
            const result = matchedJobs
                .slice(0, 5)
                .map(
                    (job) =>
                        `${job.title} at ${job.company} - ${job.location}`
                )
                .join("\n");

            return res.json({
                reply: `I found these relevant jobs:\n\n${result}`
            });
        }

        return res.json({
            reply:
                "I couldn't find a matching job. Try asking about available jobs, salary, location, remote jobs, internships, or a specific skill."
        });
    } catch (error) {
        res.status(500).json({
            message: "Chatbot error",
            error: error.message
        });
    }
};