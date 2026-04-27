import express from "express";
import users from "./modules/users/users.route";
import home from "./modules/home/home.route";
import { errorHandler } from "./common/middleware/error.middleware";
import httpLogger from "./common/logger/http-logger.middleware";

const app = express();

app.use(express.json());
app.use(httpLogger);

app.use("/api", home);
app.use("/api/users", users);

app.use(errorHandler);

export default app;
