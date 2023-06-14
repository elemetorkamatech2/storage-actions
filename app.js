const express = require('express')
const bodyParser = require('body-parser')
const {createTopic} = require('./pubsub/createWebsite')

const mongoose = require('mongoose')
const dotenv = require('dotenv')



const app = express()
const port = 8080
// יבוא והיכר של הקובץ ENV  
dotenv.config()

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(process.env.DB_CONNECTION, connectionParams)
    .then(() => {
        console.log('connect to mongoDB');
        createTopic()
   })
   .catch((error) => {
        console.log(error.message);
    })


app.use(bodyParser.json())


//יצירת מאזין בפורט שבחרנו
app.listen(port, () => {
    console.log(`my app is listening on http://localhost:${port}`);
})

