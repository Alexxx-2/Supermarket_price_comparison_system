const db = require("../db");

module.exports = {
    getAll: (cb) => {
        db.query("SELECT * FROM supermarkets", cb);
    },

    create: (data, cb) => {
        db.query(
            "INSERT INTO supermarkets(name,location) VALUES (?,?)",
            [data.name, data.location],
            cb
        );
    }
};