const Product = require("../models/Product");
const format = require("../utils/response");

// ADD PRODUCT (ADMIN)
exports.create = (req, res) => {

    const { name, category, description } = req.body;

    const image = req.file ? req.file.filename : null;

    if (!name || !category) {
        return res.status(400).json(
            format(false, "Name and category required")
        );
    }

    Product.create(
        { name, category, description, image },
        (err) => {

            if (err) {
                return res.status(500).json(
                    format(false, "Database error")
                );
            }

            res.status(201).json(
                format(true, "Product created")
            );
        }
    );
};

// UPDATE PRODUCT
exports.update = (req, res) => {

    const id = req.params.id;
    const { name, category, description } = req.body;

    const image = req.file ? req.file.filename : null;

    Product.update(
        id,
        { name, category, description, image },
        (err) => {

            if (err) {
                return res.status(500).json(
                    format(false, "Update failed")
                );
            }

            res.json(
                format(true, "Product updated")
            );
        }
    );
};

// GET ALL
exports.getAll = (req, res) => {
    Product.getAll((err, result) => {

        if (err) {
            return res.status(500).json(
                format(false, "Error fetching products")
            );
        }

        res.json(
            format(true, "Products retrieved", result)
        );
    });
};