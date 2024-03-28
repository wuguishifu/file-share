import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';
import sanitize from 'sanitize-filename';

const uniqueNamesConfig: Config = {
    dictionaries: [adjectives, colors, animals],
    separator: '-',
    length: 3,
};

const dataPath = process.env.NODE_ENV === 'production' ? '/data' : path.join(__dirname, '..', 'test-data');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, dataPath);
    },
    filename: (req, file, cb) => {
        cb(null, uniqueNamesGenerator(uniqueNamesConfig) + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

export const router = express.Router();

router.get('/', (_, res) => {
    return res.status(200).send('<h1>Hello World!</h1>');
});

router.get('/list', (_, res) => {
    const dir = fs.readdirSync(dataPath);
    return res.status(200).send(JSON.stringify(dir));
});

router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).send({ uploaded: false, error: 'no file uploaded' });
    return res.status(201).send({ uploaded: true, filename: req.file.filename });
});

router.get('/files/:filename', (req, res) => {
    const filename = sanitize(req.params.filename);
    const filePath = path.join(dataPath, filename);

    res.sendFile(filePath, (error) => {
        if (error) return res.status(404).send({ error: 'file not found' });
    });
});

router.delete('/files/:filename', (req, res) => {
    const filename = sanitize(req.params.filename);
    const filePath = path.join(dataPath, filename);

    fs.unlink(filePath, (error) => {
        if (error) return res.status(404).send({ error: 'file not found' });
        return res.status(200).send({ deleted: true });
    });
});
