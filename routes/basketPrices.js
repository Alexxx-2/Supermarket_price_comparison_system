const express = require("express");
const router = express.Router();

const basketController =
require("../controllers/basketController");

router.post(
    "/create",
    basketController.createBasket
);

router.post(
    "/add-item",
    basketController.addItem
);

router.get(
    "/:basketId",
    basketController.getBasketItems
);

router.put(
    "/update/:basketItemId",
    basketController.updateQuantity
);

router.delete(
    "/delete/:basketItemId",
    basketController.removeItem
);

module.exports = router;