export default function QueryParameters(app) {
  const calculator = (req, res) => {
    const { a, b, operation } = req.query;
    if (
      typeof a === "undefined" ||
      typeof b === "undefined" ||
      typeof operation === "undefined"
    ) {
      res.status(400).send("Missing parameters");
      return;
    }
    const ai = parseInt(a);
    const bi = parseInt(b);
    let result;
    switch (operation) {
      case "add":
        result = ai + bi;
        break;
      case "subtract":
        result = ai - bi;
        break;
      case "multiply":
        result = ai * bi;
        break;
      case "divide":
        if (bi === 0) {
          res.status(400).send("Division by zero");
          return;
        }
        result = ai / bi;
        break;
      default:
        res.status(400).send("Invalid operation");
        return;
    }
    res.send(result.toString());
  };

  app.get("/lab5/calculator", calculator);
}
