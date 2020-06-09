const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config();

const app = express();
app.use(cors(4200));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./app/controllers/index')(app);

app.listen(process.env.APP_PORT);