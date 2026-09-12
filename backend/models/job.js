import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        company: {
            type: String,
            required: true,
            trim: true
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        salary: {
            type: String,
            default: ""
        },

        jobType: {
            type: String,
            enum: ["Full Time", "Part Time", "Remote", "Internship"],
            default: "Full Time"
        },

        skills: {
            type: [String],
            default: []
        },

        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);

export default Job;