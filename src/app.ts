import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send({ message: "API is ready for requests 🚀" });
});

export default app;
