import bcrypt from 'bcryptjs';
import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { db } from '../store';

export const authRouter = express.Router();

authRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username) return res.status(400).send({ error: 'missing username' });
    if (!password) return res.status(400).send({ error: 'missing password' });

    let user;
    try {
        user = await db.getData(`/users/${username}`);
    } catch (error) {
        if (process.env.NODE_ENV === 'production') {
            return res.status(401).send({ error: 'invalid credentials' });
        } else {
            return res.status(404).send({ error: 'user not found' });
        }
    }
    if (!user?.password || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).send({ error: 'invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, 'secret');
    res.status(200).send({ token });
});

export function verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(403).send({ erorr: 'missing credentials' });

    try {
        jwt.verify(token, 'secret');
    } catch (error) {
        return res.status(401).send({ error: 'invalid credentials' });
    }

    next();
};
