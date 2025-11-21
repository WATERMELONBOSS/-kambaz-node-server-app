import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app, db) {
  const dao = EnrollmentsDao(db);

  app.get("/api/courses/:courseId/enrollments", (req, res) => {
    const { courseId } = req.params;
    const enrollments = dao.findEnrollmentsForCourse(courseId);
    res.json(enrollments);
  });

  app.post("/api/courses/:courseId/enrollments", (req, res) => {
    const { courseId } = req.params;
    const { user } = req.body || {};
    if (!user) return res.status(400).json({ error: "user is required" });
    const created = dao.enrollUserInCourse(user, courseId);
    res.json(created);
  });

  app.delete("/api/enrollments/:enrollmentId", (req, res) => {
    const { enrollmentId } = req.params;
    const result = dao.deleteEnrollment(enrollmentId);
    res.json(result);
  });

  app.delete("/api/courses/:courseId/enrollments", (req, res) => {
    // allow deleting by user+course pair
    const { courseId } = req.params;
    const { user } = req.body || {};
    if (!user) return res.status(400).json({ error: "user is required" });
    const result = dao.unenrollUserFromCourse(user, courseId);
    res.json(result);
  });
}
