const express = require("express");
const router = express.Router();
const db = require("../../db");

router.get("/checklink/", async (req, res) => {
    try {
        const results = await db.checkLink(req.query.id);

        if (results.rows.length == 1) {
            res.json({
                success: true,
            });
        } else {
            res.json({
                success: false,
            });
        }
    } catch (err) {
        console.log("Error in get /checklink db query: ", err);
    }
});

module.exports = router;
