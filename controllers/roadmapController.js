import generateGeminiRoadmap from "../services/geminiService.js";
import roadmap from "../models/Roadmap.js";
// export const generateCareerRoadmap = async (req, res) => {
//   const { goal } = req.body;
//   const userId=req.user._id;

//   if (!goal) {
//     return res.status(400).json({ message: "Please provide a career goal." });
//   }

//   try {
//     const steps=await generateGeminiRoadmap(goal);
//     const roadMap = await roadmap.create({
//       user: userId,
//       goal,
//       steps: steps.map((step, index) => ({
//         stepNum: index + 1,
//         title: step.title,
//         description: step.description,
//         tools: step.tools || [],
//       })),
//     });
//     res.status(200).json({roadMap });
//   } catch (error) {
//     console.error("Roadmap Generation Error:", error.message);
//     res.status(500).json({ message: "Failed to generate roadmap." });
//   }
// };

export const generateCareerRoadmap = async (req, res) => {
  const { goal } = req.body;

  const userId=req.user._id;
  if (!goal) {
    return res.status(400).json({ message: "Please provide a career goal." });
  }

  try {
    const steps = await generateGeminiRoadmap(goal);
     const roadMap = {
      user: userId,
      goal,
      steps: steps.map((step, index) => ({
        stepNum: index + 1,
        title: step.title,
        description: step.description,
        tools: step.tools || [],
      })),
    };
    res.status(200).json({ roadMap }); 
  } catch (error) {
    console.error("Roadmap Generation Error:", error.message);
    res.status(500).json({ message: "Failed to generate roadmap." });
  }
};
export const saveCareerRoadmap = async (req, res) => {
  const { goal, steps } = req.body;
  const userId = req.user._id;

  if (!goal || !steps || steps.length === 0) {
    return res.status(400).json({ message: "Missing goal or steps" });
  }

  try {
    const roadMap = await roadmap.create({
      user: userId,
      goal,
      steps: steps.map((step, index) => ({
        stepNum: index + 1,
        title: step.title,
        description: step.description,
        tools: step.tools || [],
      })),
    });

    res.status(201).json({ message: "Roadmap saved", roadMap });
  } catch (error) {
    console.error("Save Roadmap Error:", error.message);
    res.status(500).json({ message: "Failed to save roadmap." });
  }
};



export const markStepComplete=async (req,res)=>{
  const {roadmapId,stepNumber}=req.body;
   const userId = req.user._id;

   try {
    const roadMap = await roadmap.findOne({ _id: roadmapId, user: userId });

    if (!roadMap) return res.status(404).json({ message: "Roadmap not found" });

    const step = roadMap.steps.find((s) => s.stepNum === stepNumber);
    if (!step) return res.status(404).json({ message: "Step not found" });

    step.completed = !step.completed;

    await roadMap.save();

    res.status(200).json({ message: "Step status updated", roadMap });
  } catch (err) {
    res.status(500).json({ message: "Failed to update step" });
  }
}

export const getRoadmapProgress = async (req, res) => {
  const { roadmapId } = req.params;
  const userId = req.user._id;

  try {
    const roadMap = await roadmap.findOne({ _id: roadmapId, user: userId });
    if (!roadMap) return res.status(404).json({ message: "Roadmap not found" });

    const total = roadMap.steps.length;
    const completed = roadMap.steps.filter((s) => s.completed).length;

    const percentage = Math.round((completed / total) * 100);

    res.status(200).json({ percentage, total, completed, steps: roadMap.steps });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch progress" });
  }
};

export const addResourceToStep = async (req, res) => {
  const { roadmapId, stepNum } = req.params;
  const { title, type, link } = req.body;

  try {
    const roadMap = await roadmap.findById(roadmapId);
    const step = roadMap.steps.find((s) => s.stepNum == stepNum);

    if (!step) return res.status(404).json({ message: "Step not found" });

    step.resources.push({ title, type, link });
    await roadMap.save();

    res.status(200).json({ message: "Resource added", step });
  } catch (err) {
    res.status(500).json({ message: "Failed to add resource" });
  }
};



export const getAllRoadmaps = async (req, res) => {
  const userId = req.user._id;

  try {
    const roadMaps = await roadmap.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({ count: roadMaps.length, roadMaps });
  } catch (err) {
    console.error("Error fetching roadmaps:", err.message);
    res.status(500).json({ message: "Failed to fetch roadmaps" });
  }
};