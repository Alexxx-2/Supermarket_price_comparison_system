const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "supermarket_price_comparison_db"
});

db.connect(err => {
    if (err) console.log("DB Error:", err);
    else console.log("MySQL Connected");
});

module.exports = db;