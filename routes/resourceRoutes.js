import express from "express"
import { getResources } from "../controllers/resourceController.js";
// const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/",  getResources);

export default router;
