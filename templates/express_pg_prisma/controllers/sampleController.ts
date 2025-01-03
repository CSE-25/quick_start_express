import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const test = async (_, res: Response): Promise<any> => {
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
    return res.status(400).json({ error: error });
  }
};

export const getUsers = async (_, res: Response): Promise<any> => {
  try {
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error });
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
    return res.status(500).json({ error: 'Failed to delete user' });
  }
};