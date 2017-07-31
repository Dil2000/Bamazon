DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(100),
    department_name VARCHAR(50),
    price FLOAT(30),
    stock_quantity INTEGER(10),
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES
("Strong Is the New Pretty","Books &",12.16,5),
("Bamazon Fire","Devices",29.90,20),
("Tylenol Dash ButtonL","Devices",4.99,20),
("Art -3D Oil Paintings","Arts &",67.20,1),
("3Doodler Create 3D Pen","Launchpad",87.40,14),
("Classic Carrom Board","Toys &",97.30,8),
("Decorative Hanging Plant","Home &",24.40,3),
("Coca Cola Dash ButtonL","Devices",4.200,20),
("Pillow Case","Arts &",9.99,9),
("Smart TV","Devices",989.40,12);
		