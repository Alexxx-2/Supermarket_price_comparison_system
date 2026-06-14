const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.register = (req, res) => {
    const { name, email, password } = req.body;

    const hashed = bcrypt.hashSync(password, 10);

    User.create({ name, email, password: hashed, role: "consumer" }, (err) => {
        if (err) return res.status(500).json({ success: false });

        res.json({ success: true, message: "User created" });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    User.findByEmail(email, (err, result) => {
        if (err || result.length === 0)
            return res.status(404).json({ success: false });

        const user = result[0];

        const match = bcrypt.compareSync(password, user.password);
        if (!match)
            return res.status(401).json({ success: false });

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ success: true, token, user });
    });
};