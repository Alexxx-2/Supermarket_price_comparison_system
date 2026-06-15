const db = require("../db");

module.exports = {

    setPrice: (data, cb) => {

        const checkSql = `
            SELECT * FROM product_prices
            WHERE product_id=? AND supermarket_id=?
        `;

        db.query(checkSql,
            [data.product_id, data.supermarket_id],
            (err, result) => {

                if (err) return cb(err);

                if (result.length > 0) {

                    const updateSql = `
                        UPDATE product_prices
                        SET price=?
                        WHERE product_id=? AND supermarket_id=?
                    `;

                    return db.query(updateSql,
                        [data.price, data.product_id, data.supermarket_id],
                        cb
                    );
                }

                const insertSql = `
                    INSERT INTO product_prices(product_id, supermarket_id, price)
                    VALUES (?,?,?)
                `;

                db.query(insertSql,
                    [data.product_id, data.supermarket_id, data.price],
                    cb
                );
            }
        );
    }
};