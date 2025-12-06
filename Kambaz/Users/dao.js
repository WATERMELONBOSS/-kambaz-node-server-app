import UserModel from "./model.js";
import mongoose from "mongoose";

export default function UsersDao(_db) {
  const createUser = async (user) => {
    // ensure incoming object doesn't carry an _id that interferes with MongoDB
    const data = { ...user };
    if (data._id) delete data._id;
    const created = await UserModel.create(data);
    return created.toObject();
  };

  const findAllUsers = async () => {
    // only return documents that look like users (have a username)
    return await UserModel.find({ username: { $exists: true } }).lean();
  };

  const findUserById = async (userId) => {
    // tolerate both ObjectId and arbitrary string _id values
    // Try mongoose's findById first (handles ObjectId or string),
    // then fall back to a native collection lookup for legacy string ids.
    try {
      const doc = await UserModel.findById(userId).lean();
      if (doc && doc.username) return doc;
    } catch (e) {
      // fall through to collection lookup
    }
    try {
      const doc = await UserModel.collection.findOne({ _id: String(userId) });
      if (doc && doc.username) return doc;
    } catch (e) {
      // ignore and return null
    }
    return null;
  };

  const findUserByUsername = async (username) => {
    return await UserModel.findOne({ username }).lean();
  };

  const findUserByLoginId = async (loginId) => {
    return await UserModel.findOne({ loginId }).lean();
  };

  const findUserByCredentials = async (username, password) => {
    return await UserModel.findOne({ username, password }).lean();
  };

  const updateUser = async (userId, user) => {
    // Support both ObjectId and legacy string _id values.
    try {
      if (/^[0-9a-fA-F]{24}$/.test(String(userId))) {
        const updates = { ...user };
        if (updates._id) delete updates._id;
        await UserModel.updateOne(
          { _id: new mongoose.Types.ObjectId(String(userId)) },
          { $set: updates }
        );
        const doc = await UserModel.findById(String(userId)).lean();
        return doc;
      }
    } catch (e) {
      // fall through to collection update
    }
    // For non-ObjectId ids, use native collection update
    try {
      const updates = { ...user };
      if (updates._id) delete updates._id;
      await UserModel.collection.updateOne(
        { _id: String(userId) },
        { $set: updates }
      );
      const doc = await UserModel.collection.findOne({ _id: String(userId) });
      return doc;
    } catch (e) {
      throw e;
    }
  };

  const deleteUser = async (userId) => {
    // Support both ObjectId and legacy string _id values.
    try {
      if (/^[0-9a-fA-F]{24}$/.test(String(userId))) {
        return await UserModel.findByIdAndDelete(
          new mongoose.Types.ObjectId(String(userId))
        );
      }
    } catch (e) {
      // fall through to collection deletion
    }
    try {
      const result = await UserModel.collection.deleteOne({
        _id: String(userId),
      });
      return result.deletedCount ? { deleted: true } : null;
    } catch (e) {
      throw e;
    }
  };

  const findUsersByRole = async (role) => {
    return await UserModel.find({ role, username: { $exists: true } }).lean();
  };

  const findUsersByPartialName = async (name) => {
    const regex = new RegExp(name, "i");
    return await UserModel.find({
      $and: [
        { username: { $exists: true } },
        {
          $or: [{ firstName: regex }, { lastName: regex }, { username: regex }],
        },
      ],
    }).lean();
  };

  return {
    createUser,
    findAllUsers,
    findUserById,
    findUserByUsername,
    findUserByLoginId,
    findUserByCredentials,
    updateUser,
    deleteUser,
    findUsersByRole,
    findUsersByPartialName,
  };
}
