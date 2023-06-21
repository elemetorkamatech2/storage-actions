const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// eslint-disable-next-line import/no-unresolved
const swaggerUi = require('swagger-ui-express');

const swaggerFile = require('./swagger');
const logger = require('./logger');
const websiteRouter = require('./api/routes/websiteRouter');
const backupRouter = require('./api/routes/backupRouter');

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
app.use('/website/', websiteRouter);
app.use('/backup/', backupRouter);
app.get('/', (req, res) => {
  res.status(200).send('HELLO ˜');
});
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(websiteRouter);
module.exports = app;
