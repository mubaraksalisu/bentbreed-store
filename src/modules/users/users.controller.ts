import { Request, Response } from "express";
import UsersService from "./users.service";
import BaseController from "../../common/controllers/base.controller";

export default class UsersController extends BaseController {
  constructor(private usersService: UsersService) {
    super();
  }

  register = async (req: Request, res: Response) => {
    const user = await this.usersService.create(req.body);
    return this.created(res, user, "User registered successfully");
  };

  findById = async (req: Request, res: Response) => {
    const user = await this.usersService.findById(req.params.id as string);
    return this.ok(res, user, "User retrieved successfully");
  };

  find = async (req: Request, res: Response) => {
    const { users, meta } = await this.usersService.find(req.query);
    return this.ok(res, users, "Users retrieved successfully", 200, meta);
  };

  update = async (req: Request, res: Response) => {
    const user = await this.usersService.update(
      req.params.id as string,
      req.body,
    );
    return this.ok(res, user, "User updated successfully");
  };

  remove = async (req: Request, res: Response) => {
    await this.usersService.remove(req.params.id as string);
    return this.ok(res, null, "User removed successfully", 204);
  };
}
