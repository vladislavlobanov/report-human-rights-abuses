const express = require("express");
const router = express.Router();
const db = require("../../db");
const bcrypt = require("../../bcrypt");
const uidSafe = require("uid-safe");
const cryptoRandomString = require("crypto-random-string");

router.get("/getdrafts/", async (req, res) => {
    try {
        const results = await db.getDrafts(req.session.userId);
        res.json(results.rows);
    } catch (err) {
        console.log("Error in get /getdrafts/", err);
    }
});

router.post("/senddrafts/", async (req, res) => {
    try {
        const link = await uidSafe(50);
        const secretCode = cryptoRandomString({
            length: 10,
        });
        const hashedCode = await bcrypt.hash(secretCode);

        const result = await db.insertLinks(
            req.session.userId,
            "testHeadline",
            link,
            secretCode,
            hashedCode,
            req.body.checked
        );

        await db.updateLinksReport(result.rows[0].id, req.session.userId);
        res.sendStatus(200);
    } catch (err) {
        console.log("Err in post /senddrafts/", err);
    }
});

module.exports = router;
