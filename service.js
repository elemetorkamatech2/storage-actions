import dotenv from 'dotenv';
import app from './app.js';
import logger from './logger.js';
import cors from 'cors';


const port = process.env.PORT;

app.listen(port, () => logger.info(`Server running on port ${port}, http://localhost:${port}`));
