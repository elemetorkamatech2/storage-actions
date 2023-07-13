import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import logger from './logger.js';
import websiteRouter from './api/routes/websiteRouter.js';
import websiteService from './api/services/website.service.js';
// import backupService from './api/services/backup.service.js';
import subscribe from './rabbitmq/subscriber.js';
import BackupRouter from './api/routes/backupRouter.js';
// eslint-disable-next-line no-unused-vars
import subscribers from './rabbitmq/subscribers.js';

subscribers();

const swaggerFile = JSON.parse(readFileSync('./swagger_output.json'));

const app = express();

dotenv.config();

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(process.env.DB_CONNECTION, connectionParams)
  .then(() => {
    logger.info('connect to mongoDB');
  })
  .catch((error) => {
    logger.error(error.message);
  });
  app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json());

app.use(websiteRouter);
subscribe('createwebsite1', websiteService.createweb);

app.use(BackupRouter);
// subscribe('BackupCreationQueue', backupService.createBackup);

app.get('/', (req, res) => {
  res.status(200).send('HELLO ˜');
});

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
export default app;
