const express = require('express');
//const engines = require('consolidate');
var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb+srv://admin1:admin123@cluster0-mtuo7.azure.mongodb.net/ATNCompany?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true';

var router = express.Router();

router.get('/', (req, res)=>{
    res.render('index');
});

module.exports = router;