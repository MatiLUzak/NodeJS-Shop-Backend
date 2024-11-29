-- Tworzenie tabel
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

-- Wstawianie danych
INSERT INTO Category (name) VALUES ('Elektronika'), ('Książki'), ('Odzież');

INSERT INTO OrderStatus (name) VALUES ('NIEZATWIERDZONE'), ('ZATWIERDZONE'), ('ANULOWANE'), ('ZREALIZOWANE');

INSERT INTO Product (name, description, unit_price, unit_weight, category_id) VALUES
                                                                                  ('Laptop', 'Nowoczesny laptop', 3000.00, 2.5, 1),
                                                                                  ('Smartfon', 'Smartfon z dużym ekranem', 1500.00, 0.5, 1),
                                                                                  ('Książka', 'Bestsellerowa powieść', 50.00, 0.3, 2);

-- Przykładowe zamówienie
INSERT INTO `Order` (approval_date, status_id, user_name, email, phone_number) VALUES
    (NULL, 1, 'Jan Kowalski', 'jan@example.com', '123456789');

INSERT INTO Order_Product (order_id, product_id, quantity) VALUES
                                                               (1, 1, 1),
                                                               (1, 3, 2);
