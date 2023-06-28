import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import websiteService from './api/services/websiteService.js';
import publish from './rabbitmq/publisher.js';
import subscribe from './rabbitmq/subscriber.js';
import logger from './logger.js';
import websiteRouter from './api/routes/websiteRouter.js';

const swaggerFile = JSON.parse(readFileSync('./swagger_output.json'));

const app = express();

dotenv.config();

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
publish('newQueue1', {
  msg: 'new meesege',
});

subscribe('newQueue1', websiteService.create());

mongoose.connect(process.env.DB_CONNECTION, connectionParams)
  .then(() => {
    logger.info('connect to mongoDB');
  })
  .catch((error) => {
    logger.error(error.message);
  });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json());
app.use(websiteRouter);

app.get('/', (req, res) => {
  res.status(200).send('HELLO ˜');
});

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
export default app;
