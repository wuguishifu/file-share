import express, { NextFunction, Request, Response } from 'express';
import admin from 'firebase-admin';

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

export const authRouter = express.Router();

export async function verifyToken(req: Request, res: Response, next: NextFunction) {
    const idToken = req.headers.authorization?.split('Bearer ')[1];

    if (!idToken) return res.status(401).send({ error: 'authorization missing' });

    try {
        await admin.auth().verifyIdToken(idToken);
    } catch (error) {
        return res.status(401).send({ error: 'unauthorized' });
    }

    next();
};
