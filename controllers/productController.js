const Product = require("../models/Product");
const format = require("../utils/response");

exports.create = (req, res) => {

    console.log("PRODUCT ROUTE HIT");
    console.log(req.body);

    const { name, category, description } = req.body;

    const image = req.file
        ? req.file.filename
        : null;

    if (!name || !category) {
        return res.status(400).json(
            format(false, "Name and category required")
        );
    }

    Product.create(
        {
            name,
            category,
            description,
            image
        },
        (err, result) => {

            if (err) {
                console.log("PRODUCT ERROR:", err);

                return res.status(500).json(
                    format(false, err.message)
                );
            }

            console.log("PRODUCT CREATED:", result);

            res.status(201).json(
                format(true, "Product created")
            );
        }
    );
};

exports.update = (req, res) => {

    const id = req.params.id;

    const { name, category, description } = req.body;

    const image = req.file
        ? req.file.filename
        : null;

    Product.update(
        id,
        {
            name,
            category,
            description,
            image
        },
        (err) => {

            if (err) {
                console.log("UPDATE ERROR:", err);

                return res.status(500).json(
                    format(false, err.message)
                );
            }

            res.json(
                format(true, "Product updated")
            );
        }
    );
};

exports.getAll = (req, res) => {

    Product.getAll((err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json(
                format(false, err.message)
            );
        }

        res.json(
            format(
                true,
                "Products retrieved",
                result
            )
        );
    });
};