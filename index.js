var express     = require("express")
var app         = express()
var orm         = require("orm")
var say         = require('say')
app.listen(8080)
app.use(orm.express('mongodb://localhost/mytestdata', {
    define: function (db, models, next) {
        models.message = db.define("messages", { 
            message:String,
            createdAt:String,
            read: Boolean    
        })
        next()
    }
}))
app.get('/', function(req,res) {
    if (req.query.createdAt ==null || req.query.createdAt== ''|| req.query.message == null || req.query.message == '') {
        res.status(404)
        res.end()
    } else {       
        var newRecord = {};
        newRecord.message = req.query.message
        newRecord.createdAt = req.query.createdAt
        newRecord.read = false   
        req.models.message.createAsync(newRecord)
        .then(function(results) {
            console.log(JSON.stringify(results))
        });
        //say.speak(req.query.message)
        // setTimeout(function() {
        //     say  
            
        //  }, 5000)     
        // req.models.message.find({ read:"false" }, function (err, message) {
        //      console.log("nno!"+JSON.stringify(req.models.message))
        // })
        req.models.message.findAsync({ }).then(function(results) {
            //res.send('welcome, ' + JSON.stringify(results))
            for(var i=0;i<results.length;i++){
                    if(!results[i].read){
                        var temp =results[i].message
                setTimeout(function() {
                say.speak(temp)
            
          }, 5000) 
                   
                    results[i].read=true
                    results[i].save(function(err){
                        console.log("saved!");
                    })
                    console.log(results[i].read ) 
            }

            }
            //console.log(results[0].message )   
          });    

        res.status(200)
        res.end()
    }
})
function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}