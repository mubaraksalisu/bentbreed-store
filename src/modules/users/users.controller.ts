import { Request, Response } from "express";
import UsersService from "./users.service";

export default class UsersController {
  constructor(private usersService: UsersService) {}

  register = async (req: Request, res: Response) => {
    const user = await this.usersService.create(req.body);
    res.status(201).json(user);
  };

  findById = async (req: Request, res: Response) => {
    const user = await this.usersService.findById(req.params.id as string);
    res.status(200).json(user);
  };

  find = async (req: Request, res: Response) => {
    const users = await this.usersService.find();
    res.status(200).json(users);
  };

  update = async (req: Request, res: Response) => {
    const user = await this.usersService.update(
      req.params.id as string,
      req.body,
    );
    res.status(200).json(user);
  };

  remove = async (req: Request, res: Response) => {
    await this.usersService.remove(req.params.id as string);
    res.status(204);
  };
}
