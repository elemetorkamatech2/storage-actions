var express = require("express");
var router = express.Router();
var castModule = require("../routes/websiteRoute");







router.post("/add",express.json(), (req, res)=> {
    var cast = req.body;
    castModule.addItem(cast);
    res.status(200, {"Content-Type":"application/text"});
    res.send("success");
});




module.exports = router;