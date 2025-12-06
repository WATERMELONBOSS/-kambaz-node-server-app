import mongoose from "mongoose";
import schema from "./schema.js";

const ModuleModel =
  mongoose.models.ModuleModel || mongoose.model("ModuleModel", schema);

export default ModuleModel;
