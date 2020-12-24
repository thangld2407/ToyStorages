var express = require('express');
var hbs = require('hbs');

var app = express();
app.set('view engine','hbs');
hbs.registerPartials(__dirname + '/views/partials');

var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended:false}));

var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var url = 'mongodb+srv://ledinhthang:ledinhthang2407@clusternew.nbqwo.mongodb.net/StorageToy?retryWrites=true&w=majority'


app.get('/',async(req,res) =>{
    let client  = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true });
    let dbo = client.db("StorageToy");
    let results = await dbo.collection("ListData").find({}).toArray();
    res.render('home',{model: results});
})

app.get('/update',async(req,res)=>{
    res.render('update');
})

app.post('/doupdate',async(req,res)=>{
    let client = await MongoClient.connect(url);
    let dbo = client.db("StorageToy");
    let results = await dbo.collection("ListData").findOne({}).toArray();
    res.render('home',{model:results});
})
var PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log("Server is running on PORT 3000");