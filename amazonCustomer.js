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
	DisplayAll();
});

var allDepartments = [];

// Constructor to identify Highest grossing department
var Departments = function(name, numBuys) {	
    this.departmentName = name
    this.noOfBuys = numBuys;
    this.printInfo = function(){
    	//console.log("Print : " + this.departmentName + " " + this.noOfBuys +"\n");
    }
    this.updateDep = function(name,noOfBuys){
	    if (this.departmentName === name) {
	        if(allDepartments.departmentName === name){
	    	    allDepartments.noOfBuys = 1 + this.noOfBuys;
	    	    (allDepartments.noOfBuys).push(1 + parseInt(this.noOfBuys));
		        //console.log(this.noOfBuys + "  " + this.departmentName);
		    }
	    }	   
    }
    this.findHigestGrossing = function(){
    	var HGDep = "";
    	var HiSales = 0;
    	//console.log(" HGDep + " " + HiSales);
    } 
}

// First function to display the values in the console
function DisplayAll(){
	connection.query("SELECT * FROM products",function(err,res){
		if (err) throw err;
		var depArray = [];
		console.log("\n List of Items available \n \n Id \t| Department \t| Unit Price \t| Item Name " +
		"\n -------------------------------------------------------------------------------\n")
		for (var i = 0 ; i < res.length; i++){
			console.log("  " + res[i].item_id + "\t| " + res[i].department_name + "\t| $ " + res[i].price 
				+ " \t| " + res[i].product_name);			
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
		message:"Whats the product id you want to buy ?",
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
		message : "Quantity of Items you want to buy ? ",
		validate: function(value){
        if (isNaN(value) === false && value != "") {
          return true;
        }
          return false;
        }
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

			console.log(" Item purchased successfully");
			console.log("------------------------------\n\n");
		    
		    var findGrossingDep = new Departments(department,1);
			findGrossingDep.updateDep(department,1);
			findGrossingDep.findHigestGrossing();
			findGrossingDep.printInfo();
		
		} else {
			console.log(" Insufficient quantity\n\n");
		}
		promptUser();

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
	});
}

// Find departments
function findDepartments(){
	connection.query("SELECT department_name FROM products GROUP BY department_name",
	function(err,res){
		if (err) throw err;
		for (var i = 0 ; i < res.length ; i++){
			var newDep = new Departments(res[i].department_name, 0);
			allDepartments.push(newDep);
		}
	});	
}

findDepartments();