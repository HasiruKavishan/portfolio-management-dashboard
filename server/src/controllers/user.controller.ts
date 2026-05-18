import { Request, Response } from "express";
import * as userService from "../services/user.service";

export const getUsers = (req: Request, res: Response) => {
  const users = userService.getAllUsers();
  res.json(users);
};

export const getUser = (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const user = userService.getUserById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};