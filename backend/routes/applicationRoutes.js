import express from "express";
import {
    createApplication,
    getApplications,
    updateApplicationStatus
} from "../controllers/applicationController.js";

const router = express.Router();

router.post("/", createApplication);
router.get("/", getApplications);
router.patch("/:id/status", updateApplicationStatus);

export default router;