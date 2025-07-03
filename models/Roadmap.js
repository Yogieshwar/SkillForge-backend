import mongoose from "mongoose";

const stepSchema = new mongoose.Schema({
  stepNum: Number,
  title: String,
  description: String,
  tools: [String],
  completed: { type: Boolean, default: false },
  resources: [
    {
      title: String,
      type: String, 
      link: String,
    },
  ],
});

const roadmapSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    goal: { type: String, required: true },
    steps: [stepSchema],
  },
  { timestamps: true }
);
const roadmap=mongoose.model("roadmap",roadmapSchema)
export default roadmap;
