const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();


app.get('/', (req, res)=>{
    res.send('Welcome to E-commerce website development')
})

app.listen(5000)