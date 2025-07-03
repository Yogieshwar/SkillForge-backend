import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateGeminiRoadmap = async (goal) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are a career mentor. Generate a step-by-step learning roadmap for someone who wants to become a "${goal}".
Each step should include:
- Title of the topic
- Short description
- Tools or platforms (if applicable)

Format response as a JSON array:
[
  { "step": 1, "title": "HTML Basics", "description": "...", "tools": ["W3Schools", "MDN"] },
  ...
]
Return ONLY the JSON array. Do not include any extra text.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

   
    const start = text.indexOf("[");
    const end = text.lastIndexOf("]") + 1;

    if (start === -1 || end === -1) {
      throw new Error("No JSON array found in response.");
    }

    const jsonString = text.substring(start, end);
    const roadmap = JSON.parse(jsonString);

    return roadmap;
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    throw new Error("Failed to generate roadmap from Gemini.");
  }
};


export default generateGeminiRoadmap;
