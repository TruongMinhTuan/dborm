var express     = require("express")
var app         = express()
var orm         = require("orm");
var bodyParser  = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.listen(8080)

// orm.connect("mongodb://localhost/test", function (err, db) {
//     if (err) throw err;})
// orm.connectAsync('mongodb://localhost/test')
//     .then((db) => {

//     })
//     .catch((error) => console.error('Connection error: '+error ))
 
app.use(orm.express('mongodb://localhost/student', {
    define: function (db, models, next) {
        models.person = db.define("student", { 
            frirtName:String,
            lastName:String,
            class:String
        },{
            hooks: {
                beforeCreate: function () {
                return new Promise(function(resolve, reject) {
                  if (this.class == "12.3") {
                    return reject(new Error("No Does allowed class 12.3"));
                  }
                    return resolve();
                  });
                }
              }
        });
        next();
    }
}));
app.get("/", function (req, res) {
    req.models.person.findAsync().then(function(results) {
        //res.send('welcome, ' + JSON.stringify(results))
        console.log(JSON.stringify(results) )   
      });    
    res.end()
});
app.post("/",urlencodedParser,function(req,res) {
    isnull(req.body.frirtName)
    isnull(req.body.lastName)
    isnull(req.body.class)
    var newRecord = {};
    newRecord.frirtName = req.body.frirtName
    newRecord.lastName = req.body.lastName
    newRecord.class = req.body.class
    req.models.person.createAsync(newRecord)
    .then(function(results) {
      console.log(JSON.stringify(results))
    });
    res.end()

})
//////////////////////////////////////////////////////////////////
function isnull(string){
    if(string == null ||string == '') return res.sendStatus(400)
}