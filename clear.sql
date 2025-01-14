#DROP TABLE Order_Product;
#DROP TABLE Product;
#DROP TABLE Category;
#DROP TABLE `Order`;
#DROP TABLE OrderStatus;
#DROP TABLE Users;
#DROP TABLE Roles;


INSERT INTO Product (name, quantity, description, unit_price, unit_weight, category_id)
VALUES ('Koszula', 7, 'Młodzieżowa koszula', 130, 0.2, 3);
