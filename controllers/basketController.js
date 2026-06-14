const BasketService = require("../services/basketService");
const format = require("../utils/response");

exports.createBasket = (req, res) => {
    BasketService.createBasket(req.body.user_id, (err, result) => {

        if (err) {
            return res.status(400).json(format(false, err.message));
        }

        return res.status(201).json(
            format(true, "Basket created", {
                basket_id: result.insertId
            })
        );
    });
};

exports.addItem = (req, res) => {
    const { basket_id, product_id, quantity } = req.body;

    BasketService.addItem(basket_id, product_id, quantity, (err) => {

        if (err) {
            return res.status(400).json(format(false, err.message));
        }

        return res.json(format(true, "Item added"));
    });
};

exports.getItems = (req, res) => {
    BasketService.getItems(req.params.id, (err, results) => {

        if (err) {
            return res.status(400).json(format(false, err.message));
        }

        return res.json(format(true, "Items fetched", results));
    });
};