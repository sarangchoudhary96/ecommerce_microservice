import Sequelize from "sequelize";

export default new Sequelize("ecommerce", "root", "sarang", {
  host: "localhost",
  dialect: "mysql",
  pool: {
    max: 9,
    min: 6,
    idle: 3000,
    handleDisconnects: true,
  },
  dialectOptions: {
    connectTimeout: 15000, // inital connection establish timeout
  },
  timezone: "+05:30", // Timezone for your db
  dialect: "mysql",
  port: 3306,
});

// CREATE TABLE visitor (
//     id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
//     token VARCHAR(255),
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );

// CREATE TABLE `user` (
//     id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
//     `name` VARCHAR(255),
//     username VARCHAR(255),
//     `password` VARCHAR(255),
//     gender VARCHAR(255),
//     `status` INT(6),
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );

// CREATE TABLE user_session (
//     id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
//     user_id INT(11),
//     visitor_id INT(11),
//     FOREIGN KEY (visitor_id)
//         REFERENCES visitor (id),
//     FOREIGN KEY (user_id)
//         REFERENCES `user` (id),
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );

// CREATE TABLE user_email (
//     id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
//     user_id INT(11),
//     email VARCHAR(255),
//     is_verified INT(6),
//     FOREIGN KEY (user_id)
//         REFERENCES `user` (id),
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );

// CREATE TABLE user_contact (
//     id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
//     user_id INT(11),
//     contact_number VARCHAR(11),
//     is_verified INT(6),
//     FOREIGN KEY (user_id)
//         REFERENCES `user` (id),
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );
