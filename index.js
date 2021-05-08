var express = require('express');
var path = require('path');
var cors = require('cors');
var helmet = require('helmet');
var logger = require('morgan');

require("dotenv").config();

var indexRouter = require('./routes/index');
var lightingRouter = require('./routes/lighting');

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

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})
