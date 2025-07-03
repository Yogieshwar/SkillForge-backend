import getYouTubeResources from "../services/youtubeService.js";

export const getResources = async (req, res) => {
  const { topic } = req.query;

  if (!topic) {
    return res.status(400).json({ message: "Topic is required" });
  }

  try {
    const results = await getYouTubeResources(topic);
    res.status(200).json({ topic, results });
  } catch (err) {
    console.error("YouTube Error:", err.message);
    res.status(500).json({ message: "Failed to fetch resources" });
  }
};
