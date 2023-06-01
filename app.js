// const express = require('express')
// const bodyParser = require('body-parser')
// const logger = require('./logger');
// const mongoose = require('mongoose')
// const dotenv = require('dotenv')



// const app = express()
// const port = 3000
  
// dotenv.config()

// const connectionParams = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }

// mongoose.connect(process.env.DB_CONNECTION, connectionParams)
//     .then(() => {
//         logger.info('connect to mongoDB');
//     })
//     .catch((error) => {
//         logger.error(error.message);
//     })


// app.use(bodyParser.json())

const castModule = require("./api/controller/websiteControler");
// //יצירת מאזין בפורט שבחרנו
// app.listen(port, () => {
//     logger.info(`my app is listening on http://localhost:${port}`);
// })
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

//import the controller


app.get("/", (req, res) => {
  return res.json("listin");
});

//Reference to the path
//All references that come from a path that starts with animal
//will be transferred to the above module
app.use("/cast", castModule);


app.use((error, req, res, next) => {
  res.send({ error: error.message })
})

app.listen(5000, () => {
  console.log("Server running at port 5000")
});
app.get("/getById/:myid", (req, res)=> {

  var id = req.params.myid;
  console.log(id);
  var cast = castModule.getItemById(id);
  if (cast != undefined)
  {
      
  res.status(200, {"Content-Type":"application/json"})
  res.json(cast);
  }
  if (cast == undefined) {
    res.status(404).send({ error: 'Cast not found' });
  }

});




module.exports = app;