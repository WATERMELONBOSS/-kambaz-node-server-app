import mongoose from "mongoose";
import schema from "./schema.js";

const EnrollmentModel =
  mongoose.models.EnrollmentModel || mongoose.model("EnrollmentModel", schema);

export default EnrollmentModel;
