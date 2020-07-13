//This file contains everything needed to call, and view products                                                                   

//The Node class is a small class that represents the 'node' in a Linked List                                                       
class Node {
        constructor(element) {
                this.element = element;
                this.next = null;
        }
}

/**The 'List' class represents a linked list. It is currently configured to hold product information,                               
   but it can be configured to hold any other sort of list.                                                                         
*/
class List { 
            var size;
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

/**                                                                                                                                 
   This is the element that the node is created of when the list has begun                                                          
*/
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

