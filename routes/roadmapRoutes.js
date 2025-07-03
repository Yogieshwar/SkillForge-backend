// routes/roadmapRoutes.js
import express from "express"
import { markStepComplete,getRoadmapProgress,addResourceToStep,getAllRoadmaps } from "../controllers/roadmapController.js";
import { generateCareerRoadmap } from "../controllers/roadmapController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { saveCareerRoadmap } from "../controllers/roadmapController.js";
const router = express.Router();

// router.post("/generate", protect, generateCareerRoadmap);

router.post("/generate",protect, generateCareerRoadmap);
router.post("/save", protect, saveCareerRoadmap);
router.patch("/mark", protect, markStepComplete)
router.get("/progress/:roadmapId", protect, getRoadmapProgress);
router.post("/:roadmapId/step/:stepNumber/resource", protect, addResourceToStep);
router.get("/roadmaps",protect, getAllRoadmaps);
export default router;