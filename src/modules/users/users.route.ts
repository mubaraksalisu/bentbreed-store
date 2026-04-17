import express from "express";
import UserRepository from "./users.repository";
import UsersService from "./users.service";
import UsersController from "./users.controller";

const router = express.Router();

const usersRepository = new UserRepository();
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService);

router.post("/register", usersController.register);

export default router;
