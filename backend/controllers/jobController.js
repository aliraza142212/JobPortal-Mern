import Job from "../models/job.js";

export const createJob = async (req, res) => {
    try {
        const job = await Job.create({
            ...req.body,
            postedBy: req.user?.id
        });

        res.status(201).json({
            message: "Job created successfully",
            job
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create job",
            error: error.message
        });
    }
};

export const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate("postedBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch jobs",
            error: error.message
        });
    }
};

export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate("postedBy", "name email");

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch job",
            error: error.message
        });
    }
};