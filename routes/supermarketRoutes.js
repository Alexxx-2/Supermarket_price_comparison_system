const router = require("express").Router();
const c = require("../controllers/supermarketController");

router.get("/", c.getAll);

module.exports = router;