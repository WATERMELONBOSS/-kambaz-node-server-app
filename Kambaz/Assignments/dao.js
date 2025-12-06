import { v4 as uuidv4 } from "uuid";
import AssignmentModel from "./model.js";

export default function AssignmentsDao(db) {
  async function findAssignmentsForCourse(courseId) {
    const docs = await AssignmentModel.find({ course: courseId }).lean();
    // normalize legacy `name` -> `title` for frontend compatibility
    return docs.map((d) => ({
      ...d,
      title: d.title || d.name || d._id,
    }));
  }

  async function createAssignment(assignment) {
    const newAssignment = { ...assignment, _id: uuidv4() };
    // support either `title` or legacy `name`
    if (!newAssignment.title && newAssignment.name)
      newAssignment.title = newAssignment.name;
    const created = await AssignmentModel.create(newAssignment);
    return created.toObject();
  }

  async function deleteAssignment(assignmentId) {
    return await AssignmentModel.deleteOne({ _id: assignmentId });
  }

  async function updateAssignment(assignmentId, assignmentUpdates) {
    await AssignmentModel.updateOne(
      { _id: assignmentId },
      { $set: assignmentUpdates }
    );
    return await AssignmentModel.findOne({ _id: assignmentId }).lean();
  }

  return {
    findAssignmentsForCourse,
    createAssignment,
    deleteAssignment,
    updateAssignment,
  };
}
