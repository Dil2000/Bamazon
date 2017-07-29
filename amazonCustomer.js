// Connections
var mysql = require ("mysql");
var inquirer = require("inquirer");

// Constructor to identify the hightest grossing department
var Departments = function() {
  this.departmentName = "";
  this.noOfBuys = 0;
}

// Making the connection to the database
var connection = mysql.createConnection({
	host :"localhost",
	port : 3306,
	user : "root",
	password : "dilnelsam2017",
	database : "bamazon"
});

connection.connect(function(err){
	if (err) throw err;
	DisplayAll();
});

// First function to display the values in the console
function DisplayAll(){
	connection.query("SELECT * FROM products",function(err,res){
		if (err) throw err;
		console.log("\n List of Items available \n \n Id \t| Department \t| Unit Price \t| Item Name  \n -------------------------------------------------------------------------------\n")
		for (var i = 0 ; i < res.length; i++){
			console.log("  " + res[i].item_id + "\t| " + res[i].department_name + "\t| $ " + res[i].price + " \t| " + res[i].product_name);
			// Departments[i].departmentName = res[i].department_name;
			// Departments[i].noOfBuys = 0;
		}
		console.log("\n\n");
		promptUser();
	});
}

// Identify the user - Customer or Manager
function promptUser(){
	inquirer
	.prompt([
	{
		name : "buy",
		type : "list",
		message:"Do You want to buy something ?",
		choices: ["YES", "N0"]
	}
	]).then(function(answer){
		if (answer.buy=== "YES") {
			promptProduct();
		}
		else{
			console.log(" Thank You\n\n");
		}
	});
}

// If its the customer ask for the product 
function promptProduct(){
	inquirer
	.prompt([
	{
		name : "id",
		type : "input",
		message:"Whats the product id you want to buy ?"//,
		// validate: function(value) {
  //         if (isNaN(value) === false) {
  //           return true;
  //         }
  //         return false;
  //       }
	},
	{
		name : "quantity",
		type : "input",
		message : "Quantity of Items you want to buy ? "//,
		// validate: function(value) {
  //         if (isNaN(value) === false) {
  //           return true;
  //         }
  //         return false;
        //}
	}
	]).then(function(answer){			
		var noOfProducts = productAvailability(answer.id,answer.quantity);
	});
}


// Check the availability of products
function productAvailability(itemId,quantityEntered){
	connection.query("SELECT * FROM products WHERE ?",
	[{
		item_id : itemId
	}] ,function(err,res){
		if (err) throw err;
		var noOfProducts = 0;
		var unitPrice = 0;
		var department = "";
		for (var i = 0 ; i < res.length; i++){				
			noOfProducts = res[i].stock_quantity;
			unitPrice = res[i].price;
			department = res[i].department_name;
		}
		if (noOfProducts >= quantityEntered){
			var totalPrice = unitPrice * quantityEntered;
			console.log("\n Total cost is : " + totalPrice.toFixed(2));
			var Qunatityleft = noOfProducts - quantityEntered;
			updateDatabse(itemId,Qunatityleft);
		} else {
			console.log(" Insufficient quantity\n\n");
			promptUser();
		}
		// Adding data to find the highest grossing department
		// function HighestGrossingDep(){
		// 	// switch (new Date().getDay()) {
		// 	//     case 0:
		// 	//         day = "Sunday";
		// 	//         break;
		// 	//     case 1:
		// 	//         day = "Monday";
		// 	//         break;
		// 	//     case 2:
		// 	//         day = "Tuesday";
		// 	//         break;
		// 	//     case 3:
		// 	//         day = "Wednesday";
		// 	//         break;
		// 	//     case 4:
		// 	//         day = "Thursday";
		// 	//         break;
		// 	//     case 5:
		// 	//         day = "Friday";
		// 	//         break;
		// 	//     case 6:
		// 	//         day = "Saturday";
		// 	// }
		// }
	});
}

// Update the database after selling
function updateDatabse(itemId,QunatityLeft){
	connection.query("UPDATE products SET ? WHERE ?",
		[{
			stock_quantity : QunatityLeft
		},{
			item_id : itemId
		}
		], function(err,res){
			if (err) throw err;
			console.log(" Item purchased successfully");
			console.log("------------------------------\n\n")
	});
}



