import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { handleError } from '../util/errorHandler';
const prisma = new PrismaClient();

export const test = async (_: Request, res: Response): Promise<any> => {
  return res.status(200).json({ message: 'Working' });
}

export const createUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email } = req.body;
    const newUser = await prisma.user.create({
      data: { name, email },
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.error(`[ERROR] Create User: ${error}`);
    return handleError(error, res, 'controller.log', 500, 'Failed to create user');
  }
};

export const getUsers = async (_: Request, res: Response): Promise<any> => {
  try {
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
  } catch (error) {
    console.error(`[ERROR] Get User: ${error}`);
    return handleError(error, res, 'controller.log', 500, 'Failed to get users');
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    return res.status(204).send();
  } catch (error) {
    console.error(`[ERROR] Delete User: ${error}`);
    return handleError(error, res, 'controller.log', 500, 'Failed to delete user');
  }
};