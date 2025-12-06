import { v4 as uuidv4 } from "uuid";
import CourseModel from "../Courses/model.js";

export default function ModulesDao(db) {
  async function findModulesForCourse(courseId) {
    const course = await CourseModel.findById(courseId);
    return course ? course.modules : [];
  }

  async function createModule(courseId, module) {
    const newModule = { ...module, _id: uuidv4() };
    const status = await CourseModel.updateOne({ _id: courseId }, { $push: { modules: newModule } });
    return newModule;
  }

  async function deleteModule(courseId, moduleId) {
    const status = await CourseModel.updateOne({ _id: courseId }, { $pull: { modules: { _id: moduleId } } });
    return status;
  }

  async function updateModule(courseId, moduleId, moduleUpdates) {
    const course = await CourseModel.findById(courseId);
    if (!course) return null;
    const mod = course.modules.id(moduleId);
    if (!mod) return null;
    Object.assign(mod, moduleUpdates);
    await course.save();
    return mod;
  }

  return {
    findModulesForCourse,
    createModule,
    deleteModule,
    updateModule,
  };
}
