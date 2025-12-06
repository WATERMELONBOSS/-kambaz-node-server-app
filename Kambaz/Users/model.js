import mongoose from "mongoose";
import UserSchema from "./schema.js";

const UserModel =
  mongoose.models.UserModel || mongoose.model("UserModel", UserSchema);

export default UserModel;
