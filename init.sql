CREATE TABLE Category (
                          id INT AUTO_INCREMENT PRIMARY KEY,
                          name VARCHAR(255) NOT NULL
);

CREATE TABLE Product (
                         id INT AUTO_INCREMENT PRIMARY KEY,
                         name VARCHAR(255) NOT NULL,
                         description TEXT NOT NULL,
                         unit_price DECIMAL(10,2) NOT NULL,
                         unit_weight DECIMAL(10,2) NOT NULL,
                         category_id INT NOT NULL,
                         FOREIGN KEY (category_id) REFERENCES Category(id)
);

CREATE TABLE OrderStatus (
                             id INT AUTO_INCREMENT PRIMARY KEY,
                             name VARCHAR(255) NOT NULL
);

CREATE TABLE `Order` (
                         id INT AUTO_INCREMENT PRIMARY KEY,
                         approval_date DATETIME NULL,
                         status_id INT NOT NULL,
                         user_name VARCHAR(255) NOT NULL,
                         email VARCHAR(255) NOT NULL,
                         phone_number VARCHAR(20) NOT NULL,
                         FOREIGN KEY (status_id) REFERENCES OrderStatus(id)
);

CREATE TABLE Order_Product (
                               order_id INT NOT NULL,
                               product_id INT NOT NULL,
                               quantity INT NOT NULL,
                               PRIMARY KEY (order_id, product_id),
                               FOREIGN KEY (order_id) REFERENCES `Order`(id),
                               FOREIGN KEY (product_id) REFERENCES Product(id)
);

INSERT INTO Category (name) VALUES ('Elektronika'), ('Książki'), ('Odzież');

INSERT INTO OrderStatus (name) VALUES ('NIEZATWIERDZONE'), ('ZATWIERDZONE'), ('ANULOWANE'), ('ZREALIZOWANE');

INSERT INTO Product (name, description, unit_price, unit_weight, category_id) VALUES
                                                                                  ('Laptop', 'Nowoczesny laptop', 3000.00, 2.5, 1),
                                                                                  ('Smartfon', 'Smartfon z dużym ekranem', 1500.00, 0.5, 1),
                                                                                  ('Książka', 'Bestsellerowa powieść', 50.00, 0.3, 2);

INSERT INTO `Order` (approval_date, status_id, user_name, email, phone_number) VALUES
    (NULL, 1, 'Jan Kowalski', 'jan@example.com', '123456789');

INSERT INTO Order_Product (order_id, product_id, quantity) VALUES
                                                               (1, 1, 1),
                                                               (1, 3, 2);
CREATE TABLE Roles (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       name VARCHAR(50) NOT NULL
);

INSERT INTO Roles (name) VALUES ('KLIENT'), ('PRACOWNIK');

CREATE TABLE Users (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       username VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       role_id INT NOT NULL,
                       FOREIGN KEY (role_id) REFERENCES Roles(id)
);
INSERT INTO Users (username, password, role_id)
VALUES ('user1', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 1);

INSERT INTO Users (username, password, role_id)
VALUES ('employee1', 'dd240264013eb563bee93f92e4e04a270f88e65522c1c48378d365ddc14d3fbb', 2);

