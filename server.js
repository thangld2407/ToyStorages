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
    let id = req.query.id;
    let ObjectID = require('mongodb').ObjectID(id);
    let condition = {'_id':ObjectID};
    let client  = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true });
    let dbo = client.db("StorageToy");
    let prod = await dbo.collection("ListData").findOne(condition);
    res.render('update',{model:prod});
})

app.get('/delete',async(req,res)=>{
    let id = req.query.id;
    let ObjectID = require('mongodb').ObjectID(id);
    let condition = {'_id':ObjectID};
    let client  = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true });
    let dbo = client.db("StorageToy");
    await dbo.collection("ListData").deleteOne(condition);
    res.redirect('/');
    
})

app.post('/doUpdate',async(req,res)=>{
    let nameProduct = req.body.txtProductName;
    let priceProduct = req.body.txtProductPrice;
    let newProducer = req.body.txtProducer;
    let id = req.body.id;
    
    let newValues = {$set: {productName: nameProduct,productPrice: priceProduct,producer:newProducer}};
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};

    let client  = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true });
    let dbo = client.db("StorageToy");
    await dbo.collection("ListData").updateOne(condition,newValues);
    res.redirect('/');
})

app.post('/doSearch',async(req,res)=>{
    let inputSearch = req.body.txtSearch;
    let client  = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true });
    let dbo = client.db("StorageToy");
    let results = await dbo.collection('ListData').find({productName: new RegExp(inputSearch,'i')}).toArray();
    res.render('home',{model: results});
})

app.post('/doInsert',async(req,res)=>{
    let newName = req.body.txtNewName;
    let newPrice = req.body.txtNewPrice;
    let newProducer = req.body.txtNewProducer;
    let newProduct = {
        productName: newName,
        productPrice: newPrice,
        producer: newProducer
    }
    let client  = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true });
    let dbo = client.db("StorageToy");
    await dbo.collection('ListData').insertOne(newProduct);
    res.redirect('/');
})


var PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log("Server is running on PORT " + PORT);