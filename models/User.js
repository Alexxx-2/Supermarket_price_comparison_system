const db = require("../config/db");

module.exports = {
    create: (data, cb) => {
        db.query(
            "INSERT INTO users(name,email,password,role) VALUES (?,?,?,?)",
            [data.name, data.email, data.password, data.role],
            cb
        );
    },

    findByEmail: (email, cb) => {
        db.query("SELECT * FROM users WHERE email=?", [email], cb);
    }
};