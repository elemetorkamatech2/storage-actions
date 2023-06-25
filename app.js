<<<<<<< HEAD
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';

import logger from './logger.js';
import websiteRouter from './api/routes/websiteRouter.js';

const swaggerFile = JSON.parse(readFileSync('./swagger_output.json'));
=======
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');
const logger = require('./logger');
const websiteRouter = require('./api/routes/websiteRouter');
>>>>>>> bc73c8ddc80c2c4a90ad5750c4fef9a469593e6f

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

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json());
app.use(websiteRouter);

app.get('/', (req, res) => {
  res.status(200).send('HELLO ˜');
});

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
export default app;
