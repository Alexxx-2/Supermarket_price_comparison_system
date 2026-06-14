const db = require("../db");

module.exports = {
    create: (user_id, cb) => {
        db.query("INSERT INTO baskets(user_id) VALUES (?)", [user_id], cb);
    }
};