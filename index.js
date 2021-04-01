const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const user = 'mobileHoueUser';
const pass = 'mobilehouse';

app.use(cors());
app.use(bodyParser.json())

// database connection 
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://mobileHoueUser:mobilehouse@cluster0.kjddt.mongodb.net/mobile-house?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const DatabaseCollection = client.db("mobile-house").collection("orders");
  const NewAddProduct = client.db("mobile-house").collection("mobiles");

    // add new product into database
    app.post('/addproduct', (req, res)=>{
        const product = req.body;
        NewAddProduct.insertOne(product)
        .then(result =>{
            res.send(result.insertedCount >0)
        })
    });

    // read data from database
    app.get('/mobiles', (req, res)=>{
        NewAddProduct.find({})
        .toArray((error, results)=>{
            res.send(results)
        })
    })
    app.get('/checkout', (req, res)=>{
        NewAddProduct.find({_id:'60662ae7786a1f0048aba74b'})
        .toArray((error, results)=>{
            res.send(results)
        })
    })


    // order store in database
    app.post('/placeOrder', (req, res)=>{
        const order = req.body;
        DatabaseCollection.insertOne(order)
        .then(result=>{
            if(result.insertedCount > 0){
                res.send(result.insertedCount > 0)
            }
        })
    })

});


app.get('/', (req, res)=>{
    res.send('Welcome to E-commerce website development')
})

app.listen(5000)