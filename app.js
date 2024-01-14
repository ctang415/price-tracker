const express = require('express');
const table = require('./routes/table')
const app = express();
const cors = require('cors')

app.use(express.json());
app.use(cors(
    { 
      origin: true, 
      credentials: true,    
    }
));

app.listen('3000', () => {
    console.log('Now listening at Port 3000')  
})

app.use('/', table)

module.exports = app