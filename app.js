const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const logger = require('./logger');
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const websiteRoute = require('./api/routes/websiteRoute');
const backupRoute = require('./api/routes/backupRoute');

const app = express()
const port = 3000
// יבוא והיכר של הקובץ ENV  
dotenv.config()


const app = express();
const messageRouter = require('./api/routes/websiteRoute');
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
app.use('/messages', messageRouter);
app.get('/', (req, res) => {
    res.status(200).send('HELLO ˜')
})

// require('./api/routes/websiteRoute')(app);
// require('./api/routes/websiteRoute')(app);
app.use('/website/', websiteRoute);
app.use('/backup/', backupRoute);


app.listen(process.env.PORT, () => {
  logger.info(`my app is listening on http://localhost:${process.env.PORT}`);
});


