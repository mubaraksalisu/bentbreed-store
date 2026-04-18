import express from "express";
import UserRepository from "./users.repository";
import UsersService from "./users.service";
import UsersController from "./users.controller";
import { validateReqBody } from "../../common/middleware/validate-req-body.middleware";
import {
  idParamSchema,
  registerSchema,
  updateSchema,
} from "./users.validation";
import { validateReqParams } from "../../common/middleware/validate-req-params.middleware";

const router = express.Router();

const usersRepository = new UserRepository();
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService);

const { register, findById, update, remove } = usersController;

router.post("/register", validateReqBody(registerSchema), register);
router.get("/:id", validateReqParams(idParamSchema), findById);
router.patch(
  "/:id",
  [validateReqParams(idParamSchema), validateReqBody(updateSchema)],
  update,
);
router.delete("/:id", validateReqParams(idParamSchema), remove);

export default router;
