/**
 * Heroku URL: https://sustainable-products-api.herokuapp.com/
 */
var express = require('express');
var path = require('path');
var cors = require('cors');
var helmet = require('helmet');
var logger = require('morgan');

require("dotenv").config();

var indexRouter = require('./routes/index');
var lightingRouter = require('./routes/lighting');
var heatRouter = require('./routes/heat');
var ACRouter = require('./routes/ac');

var app = express();
var PORT = process.env.PORT || 8080;

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/lighting', lightingRouter);
app.use('/heat', heatRouter);
app.use('/ac', ACRouter);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})
