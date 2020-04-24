const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
var router = express.Router();
fs = require('fs-extra');
app.use(bodyParser.urlencoded({extended: true}));

ObjectId = require('mongodb').ObjectId;

const url = 'mongodb+srv://admin1:admin123@cluster0-mtuo7.azure.mongodb.net/ATNCompany?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true';

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({storage: storage});

MongoClient.connect(url, (err, client) => {
    if (err) return console.log(err);
    db = client.db('ATNCompany')
});

//connect database and show product
router.get('/', async (req, res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNCompany");
    let results = await dbo.collection("Product").find({}).toArray();
    res.render('allProduct', { product: results });
});


//Search product (POST method)
router.post('/search', async (req, res) => {
    let search = req.body.productName;
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNCompany");
    let results = await dbo.collection("Product").find({ "ProductName": search }).toArray();
    res.render('allProduct', { product: results });
})

//delete product (GET method)
router.get('/delete', async (req, res) => {
    let client = await MongoClient.connect(url);
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let dbo = client.db("ATNCompany");
    let condition = { "_id": ObjectID(id) };
    await dbo.collection("Product").deleteOne(condition);
    let results = await dbo.collection("Product").find({}).toArray();
    res.render('allProduct', { product: results });
})
//Update product (GET method)
router.get('/edit', async (req, res) => {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;

    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNCompany");
    let result = await dbo.collection("Product").findOne({ "_id": ObjectID(id) });
    res.render('editProduct', { product: result });
})
//update product (POST method)
router.post('/edit',upload.single('picture'), async(req, res)=>{
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    let id = req.body._id;
    let name = req.body.name;
    let des = req.body.description;
    let price = req.body.price;
    let type = req.file.mimetype;
    let picture = new Buffer(encode_image, 'base64');
    let newValues = { $set: { ProductName: name, Description: des, Price: price, contentType: type, image:picture}};
   
    var ObjectID = require('mongodb').ObjectID;
    let condition = { "_id": ObjectID(id) };
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNCompany");
    await dbo.collection("Product").updateOne(condition, newValues, (err, result)=>{
        console.log(result)
        if (err) return console.log(err)
        console.log('saved to database')
    });
    let result = await dbo.collection("Product").find({}).toArray();
    res.render('allProduct', {product: result});
})

//insert
router.get('/insert', async (req, res) => {
        res.render('insertProduct');
    });

router.post('/insert',upload.single('picture'), async (req, res) => {
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');

    var insertProducts = {
        _id: req.body._id,
        ProductName: req.body.productName,
        Description: req.body.Description,
        Price: req.body.Price,
        contentType: req.file.mimetype,
        image: new Buffer(encode_image, 'base64')
    };
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNCompany");
    await dbo.collection("Product").insertOne(insertProducts, (err, result)=>{
        console.log(result)
        if (err) return console.log(err)
        console.log('saved to database')
    });
    let result = await dbo.collection("Product").find({}).toArray();
    res.render('allProduct', {product: result});
});

router.get('/photos/:id', (req, res) => {
    var filename = req.params.id;
    db.collection('Product').findOne({'_id': ObjectId(filename)}, (err, result) => {
        if (err) return console.log(err);
        res.contentType('image/jpeg');
        res.send(result.image.buffer);
    })
});

module.exports = router;