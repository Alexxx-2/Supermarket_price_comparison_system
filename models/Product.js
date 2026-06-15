const db = require("../config/db");

module.exports = {

    create: (data, cb) => {
        const sql = `
            INSERT INTO products(name, category, description, image)
            VALUES (?,?,?,?)
        `;

        db.query(sql,
            [data.name, data.category, data.description, data.image],
            cb
        );
    },

    update: (id, data, cb) => {
        const sql = `
            UPDATE products 
            SET name=?, category=?, description=?, image=?
            WHERE id=?
        `;

        db.query(sql,
            [data.name, data.category, data.description, data.image, id],
            cb
        );
    },

    getAll: (cb) => {
        db.query("SELECT * FROM products", cb);
    }
};