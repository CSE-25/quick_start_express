import { createUser, getUsers, deleteUser } from '../controllers/sampleController';
import express from 'express';

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);
router.delete("/:id", deleteUser);

export default router;
