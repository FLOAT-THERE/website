var express = require('express');
var app = express();
var routes = require('./server/routes.js');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("client")); 


app.get('/', routes.main_page);
//app.get('/quiz', routes.get_quiz);

app.post('/subscribe-modal', routes.subscribe_modal);
app.post('/subscribe-footer', routes.subscribe_footer);

var server = app.listen(3000, function () {
    console.log('Node server is running..');
});