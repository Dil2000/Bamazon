// Connections
var mysql = require ("mysql");
var inquirer = require("inquirer");

// Making the connection to the database
var connection = mysql.createConnection({
	host :"localhost",
	port : 3306,
	user : "root",
	password : "",
	database : "bamazon"
});

connection.connect(function(err){
	if (err) throw err;
	promptOptions();
});

function promptOptions(){
	inquirer
	.prompt([
	{
		name : "moptions",
		type : "list",
		message:"\n Here are your options\n",
		choices: [
					"View Products for Sale",
					"View Low Inventory",
					"Add to Inventory",
					"Add New Product"
				 ]
	}
	]).then(function(answer){
		switch (answer.moptions) {
		    case "View Products for Sale":
		        DisplayAll();
		        break;
		    case "View Low Inventory":
		    	lowInventory();
		        break;
		    case "Add to Inventory":
		        promptProduct();
		        break;
		    case "Add New Product":
		        addNewProduct();
		        break;
		}
	});
};

// Printing in Console
function printInConsole(res){
	console.log("\n\n List of Items available \n \n Id \t| Department \t| Unit Price \t| Qty \t| Item Name " +
	"\n -------------------------------------------------------------------------------\n")
	for (var i = 0 ; i < res.length; i++){
		console.log("  " + res[i].item_id + "\t| " + res[i].department_name + "\t| $ " 
			+ res[i].price + "\t| " + res[i].stock_quantity + " \t| " + res[i].product_name);
	}
	console.log("\n");	
	promptOptions();
}

//View Products for Sale
function DisplayAll(){
	connection.query("SELECT * FROM products",
	function(err,res){
		if (err) throw err;
		printInConsole(res);
    });
};

//View Low Inventory
function lowInventory(){
	connection.query("SELECT * FROM products WHERE stock_quantity BETWEEN 0 AND 5",
	function(err,res){
		if (err) throw err;
		printInConsole(res);
    });
};


// ************************************************************* //
//Add to Inventory

// If its the customer ask for the product 
function promptProduct(){
	inquirer
	.prompt([
	{
		name : "id",
		type : "input",
		message:"Whats the product id you want to add to the inventory ?",
		validate : function(value){
        if (isNaN(value) === false && value != "") {
          return true;
        }
          return false;
        }
	},
	{
		name : "quantity",
		type : "input",
		message : "Quantity you want to add ? ",
		validate: function(value){
        if (isNaN(value) === false && value != "") {
          return true;
        }
          return false;
        }
	}
	]).then(function(answer){			
		var noOfProducts = findProductforInventoryAdd(answer.id,answer.quantity);
	});
};

// Check the availability of products
function findProductforInventoryAdd(itemId,quantityEntered){
	
	connection.query("SELECT * FROM products WHERE ?",
	[{
		item_id : itemId
	}] ,function(err,res){
		
		if (err) throw err;
		var noOfProducts = 0;
		
		for (var i = 0 ; i < res.length; i++){				
			noOfProducts = res[i].stock_quantity;
		}		
		
		var newQuantity = noOfProducts + quantityEntered;
		
		updateDatabse(itemId,newQuantity);

	});
};

// Update the database after selling
function updateDatabse(itemId,newQuantity){
	connection.query("UPDATE products SET ? WHERE ?",
		[{
			stock_quantity : newQuantity
		},{
			item_id : itemId
		}
		], function(err,res){
			if (err) throw err;
			console.log(" Qunatity added to the inventory successfully");
			console.log("---------------------------------------------\n\n");
			promptOptions();
	});
};


// ************************************************************* //
//Add New Product

// If its the customer ask for the product 
function addNewProduct(){
	inquirer
	.prompt([
	{
		name : "product_name",
		type : "input",
		message:"Product Name ?",
		validate : function(value){
        if (value != "") {
          	return true;
        }
          	return false;
        }
	},
	{
		name : "department_name",
		type : "input",
		message : "Department Name ? ",
		validate: function(value){
        if (value != "") {
          	return true;
        }
          	return false;
        }
	},
	{
		name : "quantity",
		type : "input",
		message : "Quantity  ? ",
		validate: function(value){
        if (isNaN(value) === false && value != "") {
          return true;
        }
          return false;
        }
	},
	{
		name : "price",
		type : "input",
		message : "Unit Price ? ",
		validate: function(value){
        if (isNaN(value) === false && value != "") {
          	return true;
        }
         	return false;
        }
	}
	]).then(function(answer){			
		var noOfProducts = addToInventory(answer.product_name,answer.department_name,answer.quantity,answer.price);
	});
};

function addToInventory(product_name,department_name,quantity,price){
	connection.query("INSERT INTO products SET ?",
    {
      	product_name: product_name,
      	department_name: department_name,
      	stock_quantity: quantity,
      	price : price
    },
    function(err, res) {
    	if (err) throw err;
      	console.log(res.affectedRows + " New Product Added !\n");
      	console.log(" Item purchased successfully");
		console.log("------------------------------\n\n")
      	DisplayAll();
    });
};