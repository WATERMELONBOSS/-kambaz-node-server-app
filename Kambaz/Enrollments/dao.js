import { v4 as uuidv4 } from "uuid";

export default function EnrollmentsDao(db) {
  function findEnrollmentsForCourse(courseId) {
    const { enrollments } = db;
    return enrollments.filter((e) => e.course === courseId);
  }

  function enrollUserInCourse(userId, courseId) {
    const newEnrollment = { _id: uuidv4(), user: userId, course: courseId };
    db.enrollments = [...db.enrollments, newEnrollment];
    return newEnrollment;
  }

  function deleteEnrollment(enrollmentId) {
    const { enrollments } = db;
    db.enrollments = enrollments.filter((e) => e._id !== enrollmentId);
    return { success: true };
  }

  function unenrollUserFromCourse(userId, courseId) {
    const { enrollments } = db;
    db.enrollments = enrollments.filter(
      (e) => !(e.user === userId && e.course === courseId)
    );
    return { success: true };
  }

  return {
    findEnrollmentsForCourse,
    enrollUserInCourse,
    deleteEnrollment,
    unenrollUserFromCourse,
  };
}
