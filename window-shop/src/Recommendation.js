import axios from 'axios';
import base64 from 'base-64';
export { recommend, postDislikes, postLikes, postCloset, numDislikes, numLikes, getProductByImgSrc };

var numLikes = 0;
var numDislikes = 0;
var numCloset = 0;

function postDislikes(product, uid) {
    const token = 'b9bdb0efc4f677ef3e699ea413280eb3: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';
    const hash = base64.encode(token);
    const Basic = 'Basic ' + hash;
    var herokuCors = 'https://cors-anywhere.herokuapp.com/';
    let url = herokuCors + 'https://float-there.myshopify.com/admin/customers/' + uid + '/metafields.json';

    let handle = product.handle
    let variant = product.variants[0].id
    let dataToPost = {}
    dataToPost["metafield"] = {
        "namespace": "dislikes",
        "key": "item" + numDislikes, // unique key using global counter
        "value": "{\"handle\": \"" + handle + "\"  , \"variant\": \"" + variant + "\"}",
        "value_type": "json_string"
    }
    const headers = {
        Authorization: Basic,
        'Content-type': 'application/json',
        'Accept': 'text/plain'
    }
    ++numDislikes
    axios.post(url, dataToPost, { headers })
        .then(res => {
            console.log(res);
            console.log(res.data);
        }).catch((error) => {
            console.log(dataToPost)
            console.log(error.response)
        })

}
function postLikes(product, uid) {
    const token = 'b9bdb0efc4f677ef3e699ea413280eb3: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';
    const hash = base64.encode(token);
    const Basic = 'Basic ' + hash;
    var herokuCors = 'https://cors-anywhere.herokuapp.com/';
    let url = herokuCors + 'https://float-there.myshopify.com/admin/customers/' + uid + '/metafields.json';

    let handle = product.handle
    let variant = product.variants[0].id
    let dataToPost = {}
    dataToPost["metafield"] = {
        "namespace": "likes",
        "key": "item" + numLikes, // unique key using global counter
        "value": "{\"handle\": \"" + handle + "\"  , \"variant\": \"" + variant + "\"}",
        "value_type": "json_string"
    }
    const headers = {
        Authorization: Basic,
        'Content-type': 'application/json',
        'Accept': 'text/plain'
    }
    ++numLikes
    axios.post(url, dataToPost, { headers })
        .then(res => {
            console.log(res);
            console.log(res.data);
        }).catch((error) => {
            console.log(dataToPost)
            console.log(error.response)
        })

}
function postCloset(product, uid) {
    const token = 'b9bdb0efc4f677ef3e699ea413280eb3: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';
    const hash = base64.encode(token);
    const Basic = 'Basic ' + hash;
    var herokuCors = 'https://cors-anywhere.herokuapp.com/';
    let url = herokuCors + 'https://float-there.myshopify.com/admin/customers/' + uid + '/metafields.json';

    let handle = product.handle
    let variant = product.variants[0].id
    let dataToPost = {}
    dataToPost["metafield"] = {
        "namespace": "closet",
        "key": "item" + numCloset, // unique key using global counter
        "value": "{\"handle\": \"" + handle + "\"  , \"variant\": \"" + variant + "\"}",
        "value_type": "json_string"
    }
    const headers = {
        Authorization: Basic,
        'Content-type': 'application/json',
        'Accept': 'text/plain'
    }
    ++numCloset
    axios.post(url, dataToPost, { headers })
        .then(res => {
            console.log(res);
            console.log(res.data);
        }).catch((error) => {
            console.log(dataToPost)
            console.log(error.response)
        })
}

function getProductByHandle(products, handle) {
    for (let i = 0; i < products.length; i++) {
        if (products[i].handle == handle) {
            return products[i];
        }
    }
}
function getProductByImgSrc(products, src) {
    for (let i = 0; i < products.length; i++) {
        if (products[i].image.src == src) {
            return products[i];
        }
    }
}
function getMetadata(uid) {
    const token = 'b9bdb0efc4f677ef3e699ea413280eb3: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'
    const hash = base64.encode(token);
    const Basic = 'Basic ' + hash;

    var herokuCors = 'https://cors-anywhere.herokuapp.com/';
    let url = herokuCors + 'https://float-there.myshopify.com/admin/customers/' + uid + '/metafields.json';
    return new Promise(function (resolve, reject) {
        axios
            .get(url, { headers: { Authorization: Basic } })
            .then((data) => {
                resolve(data);
            })
            .catch((err) => console.log(err));

    })
}
function getAllProducts() {
    const token = 'b9bdb0efc4f677ef3e699ea413280eb3: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';
    const hash = base64.encode(token);
    const Basic = 'Basic ' + hash;

    var herokuCors = 'https://cors-anywhere.herokuapp.com/';
    let url = herokuCors + 'https://float-there.myshopify.com/admin/api/2020-04/products.json?limit=250';
    return new Promise(function (resolve, reject) {
        axios
            .get(url, { headers: { Authorization: Basic } })
            .then((data) => {
                resolve(data.data.products);
            })
            .catch((err) => console.log(err));
    })
}
async function recommend(uid) {
    let products = await getAllProducts();  // Array holding products for possible recommending. 
    let recArray = new Array(products.length).fill(0).map(() => new Array(2).fill(0)); // Array holding products ready to be sorted for recommendation
    let compArray = [   //Array that the products are being compared to
        //Item compArray[0][1] keeps a tally of the number of items being added 
        ['Tag:', 0],
        ['Active', 0],
        ['Adventure', 0],
        ['Bachelorette', 0],
        ['Beach', 0],
        ['Bold', 0],
        ['Casual', 0],
        ['Classic', 0],
        ['Cozy', 0],
        ['Dressy', 0],
        ['Elegant', 0],
        ['Flirty', 0],
        ['LA', 0],
        ['Miami', 0],
        ['NYC', 0],
        ['Sophisticated', 0],
        ['Urban', 0],
        ['Weekend', 0]
    ];
    let dislikedProducts = []

    //Retrieves likes and counts how many times every tag occurs in the likes
    let metadata = await getMetadata(uid);
    for (var x = 0; x < metadata.data.metafields.length; x++) {
        if (metadata.data.metafields[x].namespace == 'likes') {
            compArray[0][1]++;
            numLikes = numLikes + 1;
            var item = getProductByHandle(products, JSON.parse(metadata.data.metafields[x].value).handle);

            var parsedTags = item.tags.split(",");
            for (var i = 0; i < parsedTags.length; ++i) {
                var tag = parsedTags[i].trim();
                tag = tag.slice(1, tag.length - 1);
                for (var y = 1; y < compArray.length; y++) {
                    if (tag == compArray[y][0]) {
                        compArray[y][1]++;
                    }
                }
            }

        } else if (metadata.data.metafields[x].namespace == 'dislikes') {
            numDislikes = numDislikes + 1;
            var dislikedProduct = getProductByHandle(products, JSON.parse(metadata.data.metafields[x].value).handle);
            dislikedProducts.push(dislikedProduct.id);
        }
    }
    //Retrieves closet and counts how many times every tag occurs in the closet
    let otherMetaData = await getMetadata(uid);
    for (var x = 0; x < otherMetaData.data.metafields.length; x++) {
        if (otherMetaData.data.metafields[x].namespace == 'closet') {
            compArray[0][1]++;
            numCloset = numCloset + 1;
            var item = getProductByHandle(products, JSON.parse(otherMetaData.data.metafields[x].value).handle);

            var parsedTags = item.tags.split(",");
            for (var i = 0; i < parsedTags.length; ++i) {
                var tag = parsedTags[i].trim();
                tag = tag.slice(1, tag.length - 1);
                for (var y = 1; y < compArray.length; y++) {
                    if (tag == compArray[y][0]) {
                        compArray[y][1]++;
                    }
                }
            }
        }
    }
    for (var z = 1; z < compArray.length; z++) {
        compArray[z][1] = compArray[z][1] / compArray[0][1];
    }

    for (var a = 0; a < products.length; a++) {
        recArray[a][0] = products[a].id;
        var parsedTags = products[a].tags.split(",");
        for (var b = 0; b < parsedTags.length; ++b) {
            var tag = parsedTags[b].trim();
            tag = tag.slice(1, tag.length - 1);
            for (var c = 1; c < compArray.length; ++c) {
                if (compArray[c][0] == tag) {
                    recArray[a][1] = recArray[a][1] + compArray[b][1];
                }
            }
        }

    }
    let sortedRecArray = mergeSort(recArray);

    //remove dislikes from sortedRecArray
    for (var i = 0; i < sortedRecArray.length; ++i) {
        for (var j = 0; j < dislikedProducts.length; ++j) {
            if (sortedRecArray[i][0] == dislikedProducts[j]) {
                sortedRecArray.splice(i, 1);
            }
        }
    }
    console.log(sortedRecArray);
    console.log(dislikedProducts)
    return sortedRecArray;
}
const merge = (arr1, arr2) => {
    let sorted = [];

    while (arr1.length && arr2.length) {
        if (arr1[0][1] > arr2[0][1]) sorted.push(arr1.shift());
        else sorted.push(arr2.shift());
    };

    return sorted.concat(arr1.slice().concat(arr2.slice()));
};
const mergeSort = arr => {
    if (arr.length <= 1) return arr;
    let mid = Math.floor(arr.length / 2),
        left = mergeSort(arr.slice(0, mid)),
        right = mergeSort(arr.slice(mid));

    return merge(left, right);
};