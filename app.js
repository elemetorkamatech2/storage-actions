const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const logger = require('./logger');
const app = express();
const websiteRouter = require('./api/routes/websiteRoute');
const backupRouter = require('./api/routes/backupRoute');
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
app.use(bodyParser.json());

app.use('/websit', websiteRouter);
app.use('/backup/', backupRouter);
app.get('/', (req, res) => {
  res.status(200).send('HELLO ˜');
});
app.get('/', (req, res) => {
  res.status(200).send('HELLO ˜');
});
app.listen(process.env.PORT, () => {
  logger.info(`my app is listening on http://localhost:${process.env.PORT}`);
});

