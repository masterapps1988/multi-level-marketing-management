var express = require('express');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var path=require('path');
var EJS  = require('ejs');
var api = require('./routes/api');
var web = require('./routes/web');
var bodyParser = require('body-parser');
const http = require('https');

var app = express();
const port = 8080

app.options('*', cors())

app.use('/img', express.static(path.join(__dirname, '../public/img')))
app.use('/orgchart', express.static(path.join(__dirname, '../public/orgchart')))
app.use('/bower_components', express.static(path.join(__dirname, '../public/bower_components')))
app.use('/build', express.static(path.join(__dirname, '../public/build')))

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}))

app.use(cookieParser());

// API
app.use('/api/', api);

// Web
app.engine('html', EJS.renderFile);
app.set("view engine", "ejs");

app.use(express.static('public'));
app.use(express.static('resources'));
app.use('/', web);
// ENd

app.get('*', (req, res) => 
    res.status(500).send({
        success: false,
        message: "Uppss!!!"
    })
);

// http.createServer(app).listen(port, () => {
//     console.log("Server started on port " + port)
// })

app.listen(port);
console.log("Server started on port " + port);

module.exports = app;