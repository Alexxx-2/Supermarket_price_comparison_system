const router = require("express").Router();
const c = require("../controllers/comparisonController");

router.get("/:id", c.compareBasket);

module.exports = router;