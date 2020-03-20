var express = require('express');
var app = express();
var routes = require('./routes.js');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("views")); 


app.get('/', routes.main_page);

app.post('/subscribe-modal', routes.subscribe_modal);
app.post('/subscribe-footer', routes.subscribe_footer);

var server = app.listen(3000, function () {
    console.log('Node server is running..');
});