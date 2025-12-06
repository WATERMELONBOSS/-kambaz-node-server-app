import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    dob: { type: Date },
    role: {
      type: String,
      enum: ["ADMIN", "FACULTY", "TA", "STUDENT"],
      default: "STUDENT",
    },
    loginId: { type: String, index: true },
    section: { type: String },
    lastActivity: { type: Date },
    totalActivity: { type: String },
  },
  { timestamps: true }
);

export default UserSchema;
