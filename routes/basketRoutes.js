const router = require("express").Router();
const c = require("../controllers/basketController");

router.post("/", c.createBasket);
router.post("/item", c.addItem);
router.get("/:id", c.getItems);

module.exports = router;