const db = require("../db");

module.exports = {

    add: (basket_id, product_id, quantity, cb) => {

        if (!basket_id || !product_id || !quantity) {
            return cb(new Error("Missing fields"));
        }

        if (quantity <= 0) {
            return cb(new Error("Quantity must be > 0"));
        }

        const checkSql = `
            SELECT * FROM basket_items 
            WHERE basket_id=? AND product_id=?
        `;

        db.query(checkSql, [basket_id, product_id], (err, result) => {

            if (err) return cb(err);

            if (result.length > 0) {

                const updateSql = `
                    UPDATE basket_items 
                    SET quantity = quantity + ?
                    WHERE basket_id=? AND product_id=?
                `;

                return db.query(updateSql,
                    [quantity, basket_id, product_id],
                    cb
                );
            }

            const insertSql = `
                INSERT INTO basket_items (basket_id, product_id, quantity)
                VALUES (?, ?, ?)
            `;

            db.query(insertSql, [basket_id, product_id, quantity], cb);
        });
    },

    get: (basket_id, cb) => {

        if (!basket_id) return cb(new Error("basket_id required"));

        const sql = `
            SELECT bi.id, bi.quantity, p.name, p.category
            FROM basket_items bi
            JOIN products p ON p.id = bi.product_id
            WHERE bi.basket_id=?
        `;

        db.query(sql, [basket_id], cb);
    },

    update: (id, qty, cb) => {
        db.query(
            "UPDATE basket_items SET quantity=? WHERE id=?",
            [qty, id],
            cb
        );
    },

    remove: (id, cb) => {
        db.query("DELETE FROM basket_items WHERE id=?", [id], cb);
    }
};