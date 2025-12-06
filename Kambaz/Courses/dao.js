import { v4 as uuidv4 } from "uuid";
import CourseModel from "./model.js";

export default function CoursesDao(db) {
  async function findAllCourses() {
    return await CourseModel.find({}, { name: 1, description: 1 }).lean();
  }

  async function findCoursesForEnrolledUser(userId) {
    const { enrollments } = db;
    const courses = await CourseModel.find(
      {},
      { name: 1, description: 1 }
    ).lean();
    const enrolledCourses = courses.filter((course) =>
      enrollments.some(
        (enrollment) =>
          enrollment.user === userId && enrollment.course === course._id
      )
    );
    return enrolledCourses;
  }

  async function createCourse(course) {
    const newCourse = { ...course, _id: uuidv4() };
    const created = await CourseModel.create(newCourse);
    return created.toObject();
  }

  async function deleteCourse(courseId) {
    const { enrollments } = db;
    // remove enrollments in memory (db still used for enrollments until migrated)
    db.enrollments = enrollments.filter(
      (enrollment) => enrollment.course !== courseId
    );
    return await CourseModel.deleteOne({ _id: courseId });
  }

  async function updateCourse(courseId, courseUpdates) {
    return await CourseModel.updateOne(
      { _id: courseId },
      { $set: courseUpdates }
    );
  }

  return {
    findAllCourses,
    findCoursesForEnrolledUser,
    createCourse,
    deleteCourse,
    updateCourse,
  };
}
