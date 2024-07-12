const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const table = require('./routes/table');
require('./runscraper');
const app = express();

app.use(express.json());
app.use(cors(
  {
    origin: true,
    credentials: true,
  },
));
app.use(bodyParser.json());
app.use('/', table);
app.listen('3000', () => {
  console.log('Now listening at Port 3000');
});

module.exports = app;
