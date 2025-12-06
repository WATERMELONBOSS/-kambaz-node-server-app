import AssignmentsDao from "./dao.js";

export default function AssignmentsRoutes(app, db) {
  console.log("AssignmentsRoutes registering");
  const dao = AssignmentsDao(db);

  app.get("/api/courses/:courseId/assignments", async (req, res) => {
    const { courseId } = req.params;
    const assignments = await dao.findAssignmentsForCourse(courseId);
    res.json(assignments);
  });

  app.post("/api/courses/:courseId/assignments", async (req, res) => {
    const { courseId } = req.params;
    const payload = req.body || {};
    const toCreate = { ...payload, course: courseId };
    const created = await dao.createAssignment(toCreate);
    res.json(created);
  });

  app.delete("/api/assignments/:assignmentId", async (req, res) => {
    const { assignmentId } = req.params;
    const result = await dao.deleteAssignment(assignmentId);
    res.json(result);
  });

  app.put("/api/assignments/:assignmentId", async (req, res) => {
    const { assignmentId } = req.params;
    const updates = req.body || {};
    const updated = await dao.updateAssignment(assignmentId, updates);
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  });
}
