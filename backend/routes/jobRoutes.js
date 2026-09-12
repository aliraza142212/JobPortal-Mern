import express from "express";
import {
    createJob,
    getJobs,
    getJobById
} from "../controllers/JobController.js";

const router = express.Router();

router.get("/", getJobs);
router.get("/:id", getJobById);
router.post("/", createJob);

export default router;