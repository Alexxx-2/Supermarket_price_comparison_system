const Supermarket = require("../models/Supermarket");
const format = require("../utils/response");

exports.getAll = (req, res) => {
    Supermarket.getAll((err, result) => {
        if (err) return res.status(500).json(format(false, "Error"));

        res.json(format(true, "Supermarkets", result));
    });
};