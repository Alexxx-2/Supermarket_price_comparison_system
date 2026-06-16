const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.register = (req, res) => {
    console.log("REGISTER ROUTE HIT");
    console.log(req.body);

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    const hashed = bcrypt.hashSync(password, 10);

    User.create(
        {
            name,
            email,
            password: hashed,
            role: "consumer"
        },
        (err, result) => {
            if (err) {
                console.log("REGISTER ERROR:", err);

                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            console.log("USER CREATED:", result);

            res.json({
                success: true,
                message: "User created"
            });
        }
    );
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    User.findByEmail(email, (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                success: false
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const user = result[0];

        const match = bcrypt.compareSync(
            password,
            user.password
        );

        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Wrong password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            success: true,
            token,
            user
        });
    });
};