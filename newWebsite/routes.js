var tables = require('./tables.js');  // double check whether path works
var async = require('async'); 


var mainpage = function (req, res) {
    res.render('index.ejs', {messagemodal: null, messagefooter: null});
}

var subscribemodal = function(req, res) {
    var email = req.body.email;
    // form validation stuff here
    tables.subscribelist.get(email, function (err, post) {   
        if (post == null) {
            var name = req.body.name;
            var date = req.body.date;
            var hearAbout = req.body.source;
            if (date == "") {;
                date = "0/0/0"
            }
            if (hearAbout == "") {
                hearAbout = "N/A";
            }
            tables.subscribelist.create({email: email, name: name, date: date,
                    hearAbout: hearAbout, location: "modal"},  function (err, acc) {
                if( err ) {
                    console.log('error in saving account', err);
                } else {
                    console.log('created account in DynamoDB', acc.get('email'));
                }
            });
            res.render('index.ejs', {messagemodal:
                 'Thanks for joining our mailing list! You may now close this window.', messagefooter:null});
        } else {
            res.render('index.ejs', {messagemodal: 'You\'ve already subscribed to our mailing list with this email.', messagefooter:null});
        }
    });	
};

var subscribefooter = function(req, res) {
    var email = req.body.email;
    // form validation stuff here
    tables.subscribelist.get(email, function (err, post) {   
        if (post == null) {
            var name = req.body.name;
            var date = req.body.date;
            var hearAbout = req.body.source;
            if (date == "") {
                date = "0/0/0"
            }
            if (hearAbout == "") {
                hearAbout = "N/A"
            }
            tables.subscribelist.create({email: email, name: name, date: date,
                    hearAbout: hearAbout, location: "footer"},  function (err, acc) {
                if( err ) {
                    console.log('error in saving account', err);
                } else {
                    console.log('created account in DynamoDB', acc.get('email'));
                }
            });
            res.render('index.ejs', {messagemodal: null, messagefooter:
                 'Thanks for joining our mailing list!'});
        } else {
            res.render('index.ejs', {messagemodal: null, messagefooter: 'You\'ve already subscribed to our mailing list with this email.'});
        }
    });	
};

var routes = {
    main_page: mainpage,
    subscribe_modal: subscribemodal,
    subscribe_footer: subscribefooter  
};

module.exports = routes;