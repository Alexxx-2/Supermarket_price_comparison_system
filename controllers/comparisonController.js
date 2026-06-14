const ComparisonService = require("../services/comparisonService");
const format = require("../utils/response");

exports.compareBasket = (req, res) => {

    ComparisonService.compareBasket(req.params.id, (err, results) => {

        if (err) {
            return res.status(400).json(format(false, err.message));
        }

        if (!results || results.length === 0) {
            return res.status(404).json(format(false, "No data found"));
        }

        const cheapest = results[0];
        const expensive = results[results.length - 1];

        return res.json(format(true, "Comparison complete", {
            cheapest,
            savings: expensive.total_cost - cheapest.total_cost,
            ranking: results
        }));
    });
};