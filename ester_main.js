// to run, type node [file-name] [orderNum] into command line
// i.e. node ester_main.js 10078

if (process.argv.length <= 2) {   //checks if an orderNum was entered into command line; if not throw an error
  throw new Error("Invalid orderNum. Please enter into console: node [file-name] [orderNum]");
}
var orderNum = process.argv.slice(2); //retrieves the orderNum from command line argument
main(orderNum);

function main(orderNum) {
  //Retrieve all customer boxes with order placed after orderNum and returns a dictionary with format {customerEmail: lastDateRented}
  getCustomerBoxOrders(orderNum, function(err, customerInfoDict) {
    if (err) throw new Error(err);
    console.log("Customer Info Dictionary: ");
    console.log(customerInfoDict);

    retrieve_customer_styles(customerInfoDict, 0);
  });
}

// Gets style IDs of the customer corresponding to customerInfoDict[customerindex]
function retrieve_customer_styles(customerInfoDict, customerIndex) {
  var customerId = Object.keys(customerInfoDict)[customerIndex]; //grabs the customer email at customerIndex
  
  if (customerIndex < Object.keys(customerInfoDict).length) {
    //make GET request to get style IDs for customerId
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

// Takes in a list of styleIds (stylesList), a dictionary of {customerEmail: lastDateRented} key-value pairs (customerInfoDict),
// an index to keep track of which customer in customerInfoDict we are looking at (customerIndex), and which style id in stylesList
// we are looking at (styleIndex). The callback parameter is included to ensure all code within handle_styles is executed before other
// code outside the function is executed 
function handle_styles(stylesList, customerInfoDict, customerIndex, styleIndex, callback) {
  var customerId = Object.keys(customerInfoDict)[customerIndex];
  var lastDateRented = customerInfoDict[customerId];
  if (styleIndex < stylesList.length) {
    //Make a GET request to retrieve information about the style ID at stylesList[styleIndex] and return it as a dictionaty called itemDict
    getStyleFromStylesCopy(stylesList[styleIndex], function(err, itemDict) {
      if (err) throw new Error(err);
          console.log("item: " + itemDict["title"]);
  
          //send PUT request to update information related to current style ID
          sendPutRequest(itemDict, customerId, lastDateRented, function(err, success) {
            if (err) throw new Error(err);
            if (success) {
              console.log("Successfully updated");
              console.log("");
            }
            //call the handle_styles function again on the next style ID (styleIndex+1) in stylesList
            handle_styles(stylesList, customerInfoDict, customerIndex, styleIndex+1, callback);
            return callback(null, true);
          });
    })
  } else {
        // If all styles in the current stylesList are handled, we can increment customerIndex to move on to the next customer in customerInfoDict
        customerIndex+=1;
        retrieve_customer_styles(customerInfoDict, customerIndex);
  }
}

// make GET request to customerBoxOrder function and return a dictionary of format {customerId:lastDateRented} on all customerIds with orders after orderNum
// The callback parameter is included to ensure all code within getCustomerBoxOrders is executed before other code outside the function is executed 
function getCustomerBoxOrders(orderNum, callback) {
  console.log("Retrieving customer box orders after order #" + orderNum);

  var request = require("request-promise");
  var options = { method: 'GET',
    url: 'https://www.floatthere.com/_functions/customerBoxOrder/' + orderNum,
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
      var lastDateRented = itemDict[i]["_updatedDate"];
      customerInfoDict[customerId] = lastDateRented;
    }
    
    return callback(null, customerInfoDict);
  });
}
 
// make GET request to stylesOfUser function and return a list of style IDs associated with customerId
// The callback parameter is included to ensure all code within getStylesOfUser is executed before other code outside the function is executed 
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

// make GET request to stylescopy function and return a dictionary with information related to styleId
// The callback parameter is included to ensure all code within getStyleFromStylesCopy is executed before other code outside the function is executed 
function getStyleFromStylesCopy(styleId, callback) {
  var request = require("request-promise");
  console.log("updating " + styleId);
  var options = { 
    method: 'GET',
    url: 'https://www.floatthere.com/_functions/stylescopy/' + styleId,
  };
  
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    var data = JSON.parse(body);
    var itemDict = data.items[0];

    return callback(null, itemDict);

  });
}

// makes a PUT request to update information on the style associated with itemDict
// The callback parameter is included to ensure all code within sendPutRequest is executed before other code outside the function is executed
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

// Generates a string of text to be used for making the PUT request. This string increments the current number of rentals and updates
// the lastCustomerRented and lastDateRented fields 
//** issue here where if column ids are null, they can not be populated through PUT request
function generatePutString(itemDict, customerId, lastDateRented){
  console.log("");
  console.log("Generating string for PUT request");
  var output = '{';

  var numKeys = Object.keys(itemDict).length;

  Object.keys(itemDict).forEach(function(key) {
      if (key == 'numberOfRentals') {
        var incrementedNum = parseInt(itemDict[key], 10) + 1;
        incrementedNum = incrementedNum.toString(10);
        iteminfo = '\n\t"' + key + '": "' + incrementedNum + '"';  
        console.log("Number of Rentals: " + incrementedNum);
      } else if (key == 'lastCustomerRented') {
        iteminfo = '\n\t"' + key + '": "' + customerId + '"';
        console.log("Last Customer Rented: " + customerId);
      } else if (key == 'lastDateRented') {
        iteminfo = '\n\t"' + key + '": "' + lastDateRented + '"';
        console.log("Last Date Rented: " + lastDateRented);
      } else {
        iteminfo = '\n\t"' + key + '": "' + itemDict[key] + '"';
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