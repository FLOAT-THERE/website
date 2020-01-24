var orderNum = 10072;

getCustomerBoxOrders(orderNum, function(err, customerInfoDict) {
  if (err) throw new Error(err);
  console.log("Customer Info Dict: ");
  console.log(customerInfoDict);

  get_styles(customerInfoDict, 0);
});

function get_styles(customerInfoDict, customerIndex) {
  var customerId = Object.keys(customerInfoDict)[customerIndex];
  
  if (customerIndex < Object.keys(customerInfoDict).length) {
    getStylesOfUser(customerId, function(err, stylesList) {
      if (err) throw new Error(err);
      console.log("Style IDs List: ");
      console.log(stylesList);

      handle_styles(stylesList, customerInfoDict, customerIndex, 0, function(err, success) {
        if (err) throw new Error(err);

      }) 

    })
  }
}

function handle_styles(stylesList, customerInfoDict, customerIndex, styleIndex, callback) {
  var customerId = Object.keys(customerInfoDict)[customerIndex];
  var lastDateRented = customerInfoDict[customerId];
  if (styleIndex < stylesList.length) {
    getStyleFromStylesCopy(stylesList[styleIndex], function(err, itemDict) {
      if (err) throw new Error(err);
          console.log("item: " + itemDict["title"]);
  
          //send put request
          sendPutRequest(itemDict, customerId, lastDateRented, function(err, success) {
            if (err) throw new Error(err);
            if (success) {
              console.log("updated in table");
            }
            handle_styles(stylesList, customerInfoDict, customerIndex, styleIndex+1, callback);
            return callback(null, true);
          });
    })
  } else {
        customerIndex+=1;
        get_styles(customerInfoDict, customerIndex);
  }
}

// return a dict of customerId : lastDateRented
function getCustomerBoxOrders(order, callback) {
  console.log("Retrieving customer box orders after order #" + order);

  var request = require("request-promise");
  var options = { method: 'GET',
    url: 'https://www.floatthere.com/_functions/customerBoxOrder/' + order,
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    
    var data = JSON.parse(body);
    
    var itemDict = data["items"];
    var numOrders = Object.keys(itemDict).length;
    var customerInfoDict = {};

    // populate customerInfoDict
    for (var i = 0; i < numOrders; i++) {
      var customerId = itemDict[i]["customerId"];
      var lastDateRented = itemDict[i]["_createdDate"];
      customerInfoDict[customerId] = lastDateRented;
    }
    
    return callback(null, customerInfoDict);
  });
}
 
function getStylesOfUser(customerId, callback) {
  console.log("Get styles of user " + customerId);

  var request = require("request-promise");
  var options = { method: 'GET',
    url: 'https://www.floatthere.com/_functions/stylesOfUser/' + customerId,
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    
    var data = JSON.parse(body);
    
    var styles = data["items"];
    var stylesList = [];
    for (styleDict of styles) {
      stylesList.push(styleDict["_id"]);
    }

    return callback(null, stylesList);
  });
}

function getStyleFromStylesCopy(style, callback) {
  var request = require("request-promise");
  console.log("updating " + style);
  var options = { 
    method: 'GET',
    url: 'https://www.floatthere.com/_functions/stylescopy/' + style,
  };
  
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    var data = JSON.parse(body);
    var itemDict = data.items[0];

    return callback(null, itemDict);

  });
}

function sendPutRequest(itemDict, customerId, lastDateRented, callback) {

    var bodyString  = generatePutString(itemDict, customerId, lastDateRented);

    var request = require("request-promise");
  
    var options = { 
      method: 'PUT',
      url: 'https://www.floatthere.com/_functions/stylescopy',
  
      body: bodyString
    };
  
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      console.log(body);
      return callback(null, true);
    });

}



function generatePutString(itemDict, customerId, lastDateRented){
  console.log("generating put string");
  var output = '{';

  var numKeys = Object.keys(itemDict).length;

  Object.keys(itemDict).forEach(function(key) {
    if (itemDict[key] == 'null') {
      iteminfo = '\n\t"' + key + '": ""';
    } else {

      if (key == 'numberOfRentals') {
        var incrementedNum = parseInt(itemDict[key], 10) + 1;
        incrementedNum = incrementedNum.toString(10);
        iteminfo = '\n\t"' + key + '": "' + incrementedNum + '"';  
      } else if (key == 'inUseCustomer') {
        iteminfo = '\n\t"' + key + '": "' + customerId + '"';
      } else if (key == 'lastDateRented') {
        iteminfo = '\n\t"' + key + '": "' + lastDateRented + '"';
      } else {
        iteminfo = '\n\t"' + key + '": "' + itemDict[key] + '"';
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

// function initialize() {
//   console.log("Initializing");

//   var request = require("request-promise");
//   var options = { method: 'GET',
//     url: 'https://www.floatthere.com/_functions/stylescopy',
//   };

//   request(options, function (error, response, body) {
//     if (error) throw new Error(error);
    
//     var data = JSON.parse(body);
//     var numItems = 0;
//     //console.log(data);
//     for (itemDict of data.items) {
//       numItems += 1;
//     }
//     console.log("numItems: " + numItems);
  
//     initialPutRequest(data.items, numItems);
//   });
// }

// var callsMade = 0
// function initialPutRequest(items, count) {

//   if (callsMade >= 1) {
//     console.log("Initial Put Request Done");
//     getRequestCustomerBoxes();
//   } else {
//     var itemDict = items[callsMade];
//     var bodyString  = generatePutString(itemDict, false, "");

//     var request = require("request-promise");
  
//     var options = { 
//       method: 'PUT',
//       url: 'https://www.floatthere.com/_functions/stylescopy',
//       body: bodyString
//     };
  
//     request(options, function (error, response, body) {
//       if (error) throw new Error(error);
//       callsMade += 1;
//       console.log(body);
//       initialPutRequest(items, count);
      
//     });
//   }
  
// }


// function getRequestCustomerBoxes() {
//   console.log("Get Customer Boxes");
//   var request = require("request-promise");

//   var options = { method: 'GET',
//     url: 'https://www.floatthere.com/_functions/customerboxes'
//   };

//   request(options, function (error, response, body) {
//     if (error) throw new Error(error);

//     var data = JSON.parse(body);
//     for (entry of data.items) {
//       var customerId = entry["customerId"];
//       var item1 = entry["items"]
//       var item2 = entry["item2"]
//       var item3 = entry["item3"]
//       var item4 = entry["item4"]
//       var item5 = entry["item5"]
//       var item6 = entry["item6"]
//       var item7 = entry["item7"]
//       var item8 = entry["item8"]
//       var item9 = entry["item9"]
//       var item10 = entry["item10"]
//       var item11 = entry["item11"]
//       var item12 = entry["item12"]

//       itemsArray = [item1, item2, item3, item4, item5, item6, item7, item8, item9, item10, item11, item12];

//       //remove items that are null
//       for(var i = itemsArray.length; i--;){
//         if (itemsArray[i] === '') {
//           itemsArray.splice(i, 1);
//         } 
//       }
//       console.log(itemsArray);
//       return itemsArray;
//       //for each item, find in styles table
//       for (var i = 0; i < itemsArray.length; i++) {
//         console.log(itemsArray[i]);
        
//       }
//     }


//   });
// }



