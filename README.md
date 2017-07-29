# Bamazon :dizzy:
## Amazon-like storefront ##

This application will take in orders from customers and deplete stock from the store's inventory. 
Major component of this project are - MySQL Database called `bamazon`, Javascript called - amazonCustomer.js which connects the database and populate the results.

### How to Use the app :running:

Identify the user mode - Customer View or the Manager View

#### If its the customer then :information_desk_person:

    * ask the ID of the product they would like to buy.
    * ask how many units of the product they would like to buy.

![starting Window](images/cus1.png "Image 1") 

If the quantity of products requested not available in the in the inventory it logs - insuffient quantity and continue the transaction.
    
![Prompt Window](images/cu3.png "Image 2")
 

After entering those details system checks for the product availability and if its avaialble calculate the final cost and remove the    products from the inventory.
	
![Transaction Done](images/cus2.png "Image 3")


    
#### If its the Manager View :japanese_goblin:
    * View Products for Sale
    * View Low Inventory
    * Add to Inventory
    * Add New Product





