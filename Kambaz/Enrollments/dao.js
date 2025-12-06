import { v4 as uuidv4 } from "uuid";
import EnrollmentModel from "./model.js";

export default function EnrollmentsDao(db) {
  async function findCoursesForUser(userId) {
    const enrollments = await EnrollmentModel.find({ user: userId }).populate(
      "course"
    );
    return enrollments.map((enrollment) => enrollment.course);
  }

  async function findEnrollmentsForCourse(courseId) {
    return await EnrollmentModel.find({ course: courseId }).lean();
  }

  async function findUsersForCourse(courseId) {
    const enrollments = await EnrollmentModel.find({
      course: courseId,
    }).populate("user");
    return enrollments.map((enrollment) => enrollment.user);
  }

  async function enrollUserInCourse(userId, courseId) {
    const id = `${userId}-${courseId}`;
    return await EnrollmentModel.create({
      _id: id,
      user: userId,
      course: courseId,
    });
  }

  async function unenrollUserFromCourse(userId, courseId) {
    return await EnrollmentModel.deleteOne({ user: userId, course: courseId });
  }

  async function unenrollAllUsersFromCourse(courseId) {
    return await EnrollmentModel.deleteMany({ course: courseId });
  }

  async function deleteEnrollment(enrollmentId) {
    return await EnrollmentModel.deleteOne({ _id: enrollmentId });
  }

  return {
    findCoursesForUser,
    findEnrollmentsForCourse,
    findUsersForCourse,
    enrollUserInCourse,
    unenrollUserFromCourse,
    unenrollAllUsersFromCourse,
    deleteEnrollment,
  };
}
