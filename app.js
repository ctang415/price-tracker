const express = require('express');
const table = require('./routes/table')
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')

app.use(express.json());
app.use(cors(
    { 
      origin: true, 
      credentials: true,    
    }
));
app.use(bodyParser.json())

app.listen('3000', () => {
    console.log('Now listening at Port 3000')  
})

app.use('/', table)

module.exports = app