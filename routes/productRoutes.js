const router = require("express").Router();
const c = require("../controllers/productController");

router.get("/", c.getAll);

module.exports = router;