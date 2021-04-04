const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const user = 'mobileHoueUser';
const pass = 'mobilehouse';
app.use(cors());
app.use(bodyParser.json())
require('dotenv').config();

// database connection 
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('bson');
const uri = "mongodb+srv://mobileHoueUser:mobilehouse@cluster0.kjddt.mongodb.net/mobile-house?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const ordersCollection = client.db("mobile-house").collection("orders");
  const allProducts = client.db("mobile-house").collection("mobiles");
   
    // add new product into database
    app.post('/addproduct', (req, res)=>{
        const product = req.body;
        allProducts.insertOne(product)
        .then(result =>{
            res.send(result.insertedCount >0)
        })
    });

    // read data from database
    app.get('/mobiles', (req, res)=>{
        allProducts.find({})
        .toArray((error, results)=>{
            res.send(results)
        })
    })
 
     // read checkout product from database
     app.get('/mobile/:id', (req, res)=>{
        const pid = req.params.id;
        allProducts.find({_id:ObjectId(req.params.id)})
        .toArray((err, documents)=>{
            res.send(documents[0])
        })
    });

    // order store in database
    app.post('/placeOrder', (req, res)=>{
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result=>{
            if(result.insertedCount > 0){
                res.send(result.insertedCount > 0)
            }
        })
    })
    // read customer order from database for UI view
    app.get('/orders', (req, res)=>{
        ordersCollection.find({email:req.query.email})
        .toArray((error, documents)=>{
            res.send(documents)
        })
    });
  
    app.delete('/delete/:id', (req, res)=>{
        allProducts.deleteOne({_id:ObjectId(req.params.id)})
        .then(result =>{
            res.send( result.deletedCount > 0)
        })
    })


});


app.get('/', (req, res)=>{
    res.send('Welcome to E-commerce website development')
})

app.listen(process.env.PORT || 5000)