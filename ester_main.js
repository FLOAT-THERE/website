//initialize();
getRequestCustomerBoxes();

function initialize() {
  console.log("Initializing");

  var request = require("request-promise");
  var options = { method: 'GET',
    url: 'https://www.floatthere.com/_functions/stylescopy',
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    
    var data = JSON.parse(body);
    var numItems = 0;
    //console.log(data);
    for (itemDict of data.items) {
      numItems += 1;
    }
    console.log("numItems: " + numItems);
  
    initialPutRequest(data.items, numItems);
  });
}

var callsMade = 0
function initialPutRequest(items, count) {

  if (callsMade >= 1) {
    console.log("Initial Put Request Done");
    getRequestCustomerBoxes();
  } else {
    var itemDict = items[callsMade];
    var bodyString  = generatePutString(itemDict, false);

    var request = require("request-promise");
  
    var options = { 
      method: 'PUT',
      url: 'https://www.floatthere.com/_functions/stylescopy',
      body: bodyString
    };
  
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      callsMade += 1;
      console.log(body);
      initialPutRequest(items, count);
      
    });
  }
  
}

function getRequestCustomerBoxes() {
  console.log("Get Customer Boxes");
  var request = require("request-promise");

  var options = { method: 'GET',
    url: 'https://www.floatthere.com/_functions/customerboxes'
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    var data = JSON.parse(body);
    for (entry of data.items) {
      var item1 = entry["items"]
      var item2 = entry["item2"]
      var item3 = entry["item3"]
      var item4 = entry["item4"]
      var item5 = entry["item5"]
      var item6 = entry["item6"]
      var item7 = entry["item7"]
      var item8 = entry["item8"]
      var item9 = entry["item9"]
      var item10 = entry["item10"]
      var item11 = entry["item11"]
      var item12 = entry["item12"]

      itemsArray = [item1, item2, item3, item4, item5, item6, item7, item8, item9, item10, item11, item12];

      //remove items that are null
      for(var i = itemsArray.length; i--;){
        if (itemsArray[i] === '') {
          itemsArray.splice(i, 1);
        } 
      }
      console.log(itemsArray);

      //for each item, find in styles table
      for (var i = 0; i < itemsArray.length; i++) {
        //console.log(itemsArray[i]);
        //updateStyles(itemsArray[i]);
      }
    }
  });
}

function updateStyles(style) {
  var request = require("request-promise");

  var options = { 
    method: 'GET',
    url: 'https://www.floatthere.com/_functions/stylescopy',
  };
  
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    var data = JSON.parse(body);
    for (itemDict of data.items) {
      if (itemDict["title"] == style) {
        sendPutRequest(itemDict);
      }
    }
    //console.log(data);

  });
}

function sendPutRequest(itemDict) {

    var bodyString  = generatePutString(itemDict, true);

    var request = require("request-promise");
  
    var options = { 
      method: 'PUT',
      url: 'https://www.floatthere.com/_functions/stylescopy',
  
      body: bodyString
    };
  
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      console.log(body);
    });
}



function generatePutString(itemDict, incrementNumRentals){
  var output = '{';

  var numKeys = Object.keys(itemDict).length;

  Object.keys(itemDict).forEach(function(key) {
    if (itemDict[key] == 'null') {
      iteminfo = '\n\t"' + key + '": ""';
    } else {

      if (!incrementNumRentals) {
        if (key == 'numberOfRentals') {
          iteminfo = '\n\t"' + key + '": "' + '0' + '"';  
        } else {
          iteminfo = '\n\t"' + key + '": "' + itemDict[key] + '"';
        }
      } else {
        if (key == 'numberOfRentals') {
          var incrementedNum = parseInt(itemDict[key], 10) + 1;
          incrementedNum = incrementedNum.toString(10);
          iteminfo = '\n\t"' + key + '": "' + incrementedNum + '"';  
        } else {
          iteminfo = '\n\t"' + key + '": "' + itemDict[key] + '"';
        }
      }

    }

    if (numKeys != 1) {
      iteminfo += ',';
    }

    output += iteminfo;

    numKeys-=1;
  })  

  output += '}';
  //console.log(output);
  return output;

}





