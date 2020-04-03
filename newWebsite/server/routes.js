var tables = require('./tables.js'); 
var async = require('async'); 


var mainpage = function (req, res) {
    res.render('../client/landingpage.ejs', {messagemodal: null, messagefooter: null});
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
            res.render('../client/landingpage.ejs', {messagemodal:
                 'Thanks for joining our mailing list! You may now close this window.', messagefooter:null});
        } else {
            res.render('../client/landingpage.ejs', {messagemodal: 'You\'ve already subscribed to our mailing list with this email.', messagefooter:null});
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
            res.render('../client/andingpage.ejs', {messagemodal: null, messagefooter:
                 'Thanks for joining our mailing list!'});
        } else {
            res.render('../client/landingpage.ejs', {messagemodal: null, messagefooter: 'You\'ve already subscribed to our mailing list with this email.'});
        }
    });	
};

// var quiz = function (req, res) {
//     res.render('quiz.ejs', {});
// }
var routes = {
    main_page: mainpage,
    subscribe_modal: subscribemodal,
    subscribe_footer: subscribefooter,
  //  get_quiz: quiz
};

module.exports = routes;