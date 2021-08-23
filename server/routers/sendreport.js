const express = require("express");
const router = express.Router();
const db = require("../../db");

router.post("/api/sendreport", async (req, res) => {
    try {
        const results = await db.insertReport(
            req.session.userId,
            req.body.fields
        );
        res.sendStatus(200);
    } catch (err) {
        console.log("Error in get /user db query: ", err);
    }
});

module.exports = router;
