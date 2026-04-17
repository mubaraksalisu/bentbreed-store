import express from "express";
import users from "./modules/users/users.route";
import home from "./modules/home/home.route";

const app = express();

app.use(express.json());

app.use("/api", home);
app.use("/api/users", users);

export default app;
