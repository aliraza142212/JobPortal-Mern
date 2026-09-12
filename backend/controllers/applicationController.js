import Application from "../models/Application.js";

export const createApplication = async (req, res) => {
    try {
        const { job, name, email, phone, coverMessage } = req.body;

        const application = await Application.create({
            job,
            name,
            email,
            phone,
            coverMessage
        });

        res.status(201).json({
            message: "Application submitted successfully",
            application
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to submit application",
            error: error.message
        });
    }
};

export const getApplications = async (req, res) => {
    try {
        const applications = await Application.find()
            .populate("job", "title company location")
            .sort({ createdAt: -1 });

        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch applications",
            error: error.message
        });
    }
};

export const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!["Pending", "Accepted", "Rejected"].includes(status)) {
            return res.status(400).json({
                message: "Invalid application status"
            });
        }

        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate("job", "title company location");

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.status(200).json({
            message: `Application ${status.toLowerCase()} successfully`,
            application
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update application status",
            error: error.message
        });
    }
};