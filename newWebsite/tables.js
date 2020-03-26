
const Joi = require('joi');
var dynamo = require('dynamodb');
dynamo.AWS.config.update({
    "accessKeyId": "AKIATD43RUJA2YRP43WV", 
    "secretAccessKey": "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", 
    "region": "us-east-1" 
      });

var SubscribeList = dynamo.define('SubscribeList', {
    hashKey : 'email',
    
    // add the timestamp attributes (updatedAt, createdAt)
    timestamps : true,
    
    schema : {
        email   : Joi.string().email(),
        name    : Joi.string(),
        date     : Joi.string(),
        hearAbout   : Joi.string(),
    }
    });


// initilizes tables; only do this once in the beginning
/*
dynamo.createTables(function(err) {
    if (err) {
      console.log('Error creating tables: ', err);
    } else {
      console.log('Tables has been created');
    }
  });
  */
  
// we export hi so that other files (aka routes.js) can access the variable routes, where
// you can then access other variables in this file.

  var routes = {
    subscribelist: SubscribeList
  }
  
  module.exports = routes;