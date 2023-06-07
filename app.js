const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./logger');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = express()
const port = 3000
// יבוא והיכר של הקובץ ENV  
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

//יצירת מאזין בפורט שבחרנו
app.listen(port, () => {
    logger.info(`my app is listening on http://localhost:${port}`);
})
