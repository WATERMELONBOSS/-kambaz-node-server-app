import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app, db) {
  const dao = EnrollmentsDao(db);

  const findEnrollmentsForCourse = async (req, res) => {
    const { courseId } = req.params;
    const enrollments = await dao.findEnrollmentsForCourse(courseId);
    res.json(enrollments);
  };

  const createEnrollmentForCourse = async (req, res) => {
    const { courseId } = req.params;
    const { user } = req.body || {};
    if (!user) return res.status(400).json({ error: "user is required" });
    const created = await dao.enrollUserInCourse(user, courseId);
    res.json(created);
  };

  const deleteEnrollment = async (req, res) => {
    const { enrollmentId } = req.params;
    const result = await dao.deleteEnrollment(enrollmentId);
    res.json(result);
  };

  const unenrollUser = async (req, res) => {
    const { courseId } = req.params;
    const { user } = req.body || {};
    if (!user) return res.status(400).json({ error: "user is required" });
    const result = await dao.unenrollUserFromCourse(user, courseId);
    res.json(result);
  };

  app.get("/api/courses/:courseId/enrollments", findEnrollmentsForCourse);
  app.post("/api/courses/:courseId/enrollments", createEnrollmentForCourse);
  app.delete("/api/enrollments/:enrollmentId", deleteEnrollment);
  app.delete("/api/courses/:courseId/enrollments", unenrollUser);
}
