const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');

const swaggerFile = require('./swagger');
const logger = require('./logger');

const app = express()
const port = 3000
dotenv.config()

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(process.env.DB_CONNECTION, connectionParams)
    .then(() => {
        logger.info('connect to mongoDB');
    })
    .catch((error) => {
        logger.error(error.message);
    })

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.status(200).send('HELLO ˜')
})

app.use('doc',swaggerUi.serve, swaggerUi.setup(swaggerFile));
require('./api/routes/backupRouter')(app);
require('./api/routes/websiteRouter')(app);

app.listen(port, () => {
    logger.info(`my app is listening on http://localhost:${port}`);
})
