import express from "express";
import AuthController from "./auth.controller";
import AuthRepository from "./auth.repository";
import AuthService from "./auth.service";
import UsersService from "../users/users.service";
import UserRepository from "../users/users.repository";
import { validateReqBody } from "../../common/middleware/validate-req-body.middleware";
import { registerSchema } from "../users/users.validation";
import { loginSchema } from "./auth.validation";

const router = express.Router();

const authRepository = new AuthRepository();
const usersService = new UsersService(new UserRepository());
const authService = new AuthService(usersService, authRepository);
const authController = new AuthController(authService);

const { register, login } = authController;

router.post("/register", validateReqBody(registerSchema), register);
router.post("/login", validateReqBody(loginSchema), login);

export default router;
