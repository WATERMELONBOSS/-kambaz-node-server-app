import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    name: String,
    description: String,
    points: { type: Number, default: 100 },
    availableFrom: Date,
    availableUntil: Date,
    course: String,
    dueDate: Date,
  },
  { collection: "assignments" }
);

export default assignmentSchema;
