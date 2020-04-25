//npm i express --save
const express = require("express");
const app = express();

//body Parser
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

//npm i handlebars consolidate --save
const engines = require('consolidate');
app.engine('hbs',engines.handlebars);
app.set('views','./views');
app.set('view engine','hbs');

//Serving Static Resources
app.use(express.static('public'));
app.get('/', function (req, res) {
res.sendFile(__dirname + '/index');
});

//index
var indexController = require("./index.js");
app.use('/index', indexController);
//all product
var productController = require("./product.js");
app.use('/product', productController);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Listening ${ PORT }`));

var http = require('http').Server(app);

http.listen(process.env.PORT || 3000, function(){
    console.log('listening on', http.address().port);
  });
