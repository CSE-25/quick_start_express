import bcrypt from 'bcrypt';
import { User } from '../models/userModel';
import type { Request, Response } from 'express';

// Sample endpoint
export const signup = async (req: Request, res: Response) => {
  try {
    const { body } = req;
    const user_username = await User.findOne({ username: body.username });
    const user_email = await User.findOne({ email: body.email });

    if (user_email || user_username) {
      let message = `${user_username ? 'Username' : 'Email'} already exists`;
      if (user_username && user_email) {
        message = 'Username and email already exist';
      }
      return res.status(400).json({ error: true, message });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(body.password, salt);
    const new_user = await User.create({ ...body, password: hashedPassword });

    return res.status(201).json({
      error: false, message: 'User created successfully', user: {
        username: new_user.username,
        email: new_user.email,
        roles: new_user.roles,
        _id: new_user._id,
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};
