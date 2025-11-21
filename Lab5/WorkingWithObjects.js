const assignment = {
  id: 1,
  title: "NodeJS Assignment",
  description: "Create a NodeJS server with ExpressJS",
  due: "2021-10-10",
  completed: false,
  score: 0,
};

const moduleObj = {
  id: "m1",
  name: "Introduction to Node",
  description: "Basics of Node.js and Express",
  course: "CS4567",
};

export default function WorkingWithObjects(app) {
  const getAssignment = (req, res) => {
    res.json(assignment);
  };
  const getAssignmentTitle = (req, res) => {
    res.json(assignment.title);
  };
  const setAssignmentTitle = (req, res) => {
    const { newTitle } = req.params;
    assignment.title = newTitle;
    res.json(assignment);
  };
  app.get("/lab5/assignment/title/:newTitle", setAssignmentTitle);
  app.get("/lab5/assignment/title", getAssignmentTitle);
  app.get("/lab5/assignment", getAssignment);

  const getModule = (req, res) => {
    res.json(moduleObj);
  };
  const getModuleName = (req, res) => {
    res.json(moduleObj.name);
  };
  const setModuleName = (req, res) => {
    const { newName } = req.params;
    moduleObj.name = newName;
    res.json(moduleObj);
  };
  app.get("/lab5/module/name/:newName", setModuleName);
  app.get("/lab5/module/name", getModuleName);
  app.get("/lab5/module", getModule);
}
