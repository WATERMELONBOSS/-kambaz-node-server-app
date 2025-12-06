import UsersDao from "./dao.js";

export default function UserRoutes(app, db) {
  const dao = UsersDao(db);

  const createUser = async (req, res) => {
    const user = await dao.createUser(req.body);
    res.json(user);
  };

  const deleteUser = async (req, res) => {
    const userId = req.params.userId;
    await dao.deleteUser(userId);
    res.sendStatus(200);
  };

  const findAllUsers = async (req, res) => {
    const { role, name } = req.query;
    if (role) {
      res.json(await dao.findUsersByRole(role));
      return;
    }
    if (name) {
      res.json(await dao.findUsersByPartialName(name));
      return;
    }
    res.json(await dao.findAllUsers());
  };

  const findUserById = async (req, res) => {
    const userId = req.params.userId;
    res.json(await dao.findUserById(userId));
  };

  const updateUser = async (req, res) => {
    const { userId } = req.params;
    const userUpdates = req.body;
    const updated = await dao.updateUser(userId, userUpdates);
    const currentUser = req.session["currentUser"];
    if (currentUser && String(currentUser._id) === String(userId)) {
      req.session["currentUser"] = { ...currentUser, ...userUpdates };
    }
    res.json(updated);
  };

  const signup = async (req, res) => {
    const user = await dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }
    const currentUser = await dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  const signin = async (req, res) => {
    console.log("[UsersRoutes] signin body:", req.body);
    const { username, loginId, password } = req.body;
    let currentUser = null;
    if (username) {
      currentUser = await dao.findUserByCredentials(username, password);
    } else if (loginId) {
      const user = await dao.findUserByLoginId(loginId);
      if (user && user.password === password) {
        currentUser = user;
      }
    }
    if (currentUser) {
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };

  const signout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };

  const profile = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    // return fresh copy from DB if possible
    const fresh = await dao.findUserById(currentUser._id);
    res.json(fresh || currentUser);
  };

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
}
