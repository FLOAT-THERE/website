var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const GetCustomerBoxes = new XMLHttpRequest();
const customerBoxesUrl = 'https://www.floatthere.com/_functions/customerboxes'
GetCustomerBoxes.open("GET", customerBoxesUrl);
GetCustomerBoxes.responseType = 'json';
​
GetCustomerBoxes.send();
​
const GetStyles = new XMLHttpRequest();
const getStylesUrl = 'https://www.floatthere.com/_functions/styles'
GetStyles.open("GET", getStylesUrl);
GetStyles.responseType = 'json';
​
GetStyles.send();
​
var itemsArray = [];
​
GetCustomerBoxes.onreadystatechange=(e)=>{
    if (GetCustomerBoxes.readyState == 4 && GetCustomerBoxes.status == 200) {
        console.log("ready")
        var data = JSON.parse(GetCustomerBoxes.responseText);
        // console.log(myArr);
        // console.log(myArr.items);
        for(entry of data.items) {
            // console.log(item)
            var item1 = entry["item1"]
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
​
            itemsArray = [item1, item2, item3, item4, item5, item6, item7, item8, item9, item10, item11, item12];
            break;
            //console.log(itemsArray)
        }
    } else {
        console.log("error");
    }
}
​
GetStyles.onreadystatechange=(e)=>{
    if (GetStyles.readyState == 4 && GetStyles.status == 200) {
        var data = JSON.parse(GetStyles.responseText);

        for (item of itemsArray) {
            //console.log("item: " + item);
            for (entry of data.items) {
                //console.log("entrytitle: " + entry["title"]);
                if (item == entry["title"]) {
                    var numRentals = entry["numberOfRentals"];
                    var lastDateRented = entry["lastDateRented"];
                    var lastCustomerRented = entry["lastCustomerRented"];
                    var lastDestinationRented = entry["lastDestinationRented"];

                }
            }

        }
    }
}
