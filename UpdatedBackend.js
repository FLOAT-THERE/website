
class Node {
        constructor(element) {
                this.element = element;
                this.next = null;
        }
}
class List {
            var size = 0;
            constructor() {
                this.head = null;
                this.size = 0;
            }

            function add(element) {
                  var node = new Node(element);
                   var current;
                 if (this.head == null) {
                     this.head = node;
                 } else {
                         current = this.head;

                 while (current.next) {
                     current = current.next;
                 }// add node                                                                                                                                                                               
                         current.next = node;


                        }
                 this.size++;
                  }

 function delete(element) {
                var node = new Node(element);
                var current;
                var nextNode;
                if(this.head == null) {
                    console.log(“List is empty”);
                }  else {
                    current = head;
                    nextNode = head.next;
                    while(current.next) {
                        if (nextNode.element == element) {
                            if (nextNode.next == null) {
                                current.next = null;
                            } else {
                                nextNode = nextNode.next;
                                current.next = nextNode;
                                break;
                            }
                        }
                        current = current.next;
                        nextNode = nextNode.next;
                    }

                }
                                     }
            function insertAt(element, index) {
                if (index > 0 && index > this.size)
                    return false;
                else {
                    // creates a new node                                                                                                                                                                   
                    var node = new Node(element);
                    var curr, prev;

                    curr = this.head;

                    // add the element to the                                                                                                                                                               
                    // first index                                                                                                                                                                          
                    if (index == 0) {
                        node.next = this.head;
                        this.head = node;
                    } else {
                        curr = this.head;
                        var it = 0;

                        // iterate over the list to find                                                                                                                                                    
                        // the position to insert                                                                                                                                                           
                        while (it < index) {
                            it++;
                            prev = curr;
                            curr = curr.next;
                        }

                        // adding an element                                                                                                                                                                
                        node.next = curr;
                        prev.next = node;
                    }
                    this.size++;
                }
            }
            function isEmpty() {
                return this.size == 0;
            }
            function size_of_list() {
                console.log(this.size);
            }

           }

class Product {
    var id;
    var productImage;
    var variant_ids;
    constructor(id, variant, image) {
        this.id = id;
        this.productImage = image;
        this.variant_ids = variant;
    }
    function getProductImage() {
        return productImage;
    }
    function getVariants() {
        return variant_ids;
    }
    function getId() {
        return id;
    }

}


function getProducts() {
        var URL = “https://b9bdb0efc4f677ef3e699ea413280eb3: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@float-there.myshopify.com/admin/api/2020-04/products.json?fields=id,images,variants”;                    
        console.write(URL);
        try {
                let request = new XMLHttpRequest();
                request.open(“GET”, URL);
                request.send();
                request.onload = () => {console.log(request);
                                        if (request.status == 200) {
                                        var products = JSON.parse(request.response);
                                        var length = products.keys(data.shareInfo[I]).length;
                                        List myProductList = new List;
                                for (int x = 0; x < length; x++) {
                                    var element = new Element(products[x].id, products[x].variants, products[x].images);
                                    var node = new Node(element);
                                    myProductList.add(node);

                                }
                                  return myProductList;
                             }
                           }
                        } else {
                                console.log(‘error ${request.status} {$request.statusText}’)
                        }
                }
        }
   }

function getUserData(uid) {
        let customerURL = “https://b9bdb0efc4f677ef3e699ea413280eb3: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@float-there.myshopify.com/admin/customers/”;                                                     
        let URL = customerURL + uid + ‘/metafields.json’;
        document.write(URL);
        let request = new XMLHttpRequest();
    try { 
         request.open(‘GET’,URL);
        request.send;
         request.onload = () => {
             console.log(request);
             if (request.status == 200) { 
                var rdict = JSON.parse(request.response);
             } else {
                 console.log(‘error ${request.status} {$request.statusText}’)
             }
         }
        }

}

