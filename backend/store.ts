import { Config, JsonDB } from 'node-json-db';
import path from 'path';

export const dataPath = process.env.NODE_ENV === 'production' ? '/data' : path.join(__dirname, 'test-data');

export const db = new JsonDB(new Config(`${dataPath}/db.json`, true, true, '/'));
