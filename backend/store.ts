import path from 'path';

export const dataPath = process.env.NODE_ENV === 'production' ? '/data' : path.join(__dirname, 'test-data');
