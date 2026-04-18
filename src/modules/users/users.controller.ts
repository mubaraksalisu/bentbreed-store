import { NextFunction, Request, Response } from "express";
import UsersService from "./users.service";

export default class UsersController {
  constructor(private usersService: UsersService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.usersService.create(req.body);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.usersService.findById(req.params.id as string);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };
}
