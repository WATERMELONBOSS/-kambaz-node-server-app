import PathParameters from "./PathParameters.js";
import QueryParameters from "./QueryParameters.js";
import WorkingWithObjects from "./WorkingWithObjects.js";
import WorkingWithArrays from "./WorkingWithArrays.js";

export default function Lab5(app) {
  app.get("/lab5/welcome", (req, res) => {
    console.log(
      `/lab5/welcome requested from origin=${
        req.headers.origin || req.ip
      } method=${req.method}`
    );
    res.send("Welcome to Lab 5");
  });
  PathParameters(app);
  QueryParameters(app);
  WorkingWithObjects(app);
  WorkingWithArrays(app);
}
