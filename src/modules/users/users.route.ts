import express from "express";
import UserRepository from "./users.repository";
import UsersService from "./users.service";
import UsersController from "./users.controller";
import { validate } from "../../common/middleware/validate.middleware";
import { registerSchema } from "./users.validation";

const router = express.Router();

const usersRepository = new UserRepository();
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService);

const { register } = usersController;

router.post("/register", validate(registerSchema), register);

export default router;
