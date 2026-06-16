const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "127.0.0.1",   // IMPORTANT (not localhost)
    user: "root",
    password: "",
    database: "supermarket_price_comparison_db",
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.log("DB connection failed:", err);
    } else {
        console.log("DB connected successfully");
    }
});

module.exports = db;