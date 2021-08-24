const express = require("express");
const router = express.Router();
const db = require("../../db");
const bcrypt = require("../../bcrypt");
const uidSafe = require("uid-safe");
const cryptoRandomString = require("crypto-random-string");
const ses = require("../ses");
const secrets = require("../secrets");

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
            req.body.headline,
            link,
            secretCode,
            hashedCode,
            req.body.checked
        );

        await db.updateLinksReport(result.rows[0].id, req.session.userId);

        if (!req.body.checked) {
            await ses.sendEmail(
                secrets.email,
                `${req.headers.origin}/case/${link}`,
                secretCode
            );
        }

        console.log("Emails have been sent");

        res.sendStatus(200);
    } catch (err) {
        console.log("Err in post /senddrafts/", err);
    }
});

router.get("/getorganizations/", async (req, res) => {
    try {
        const results = await db.getOrganizations();
        res.json(results.rows);
    } catch (err) {
        console.log("Error in get /getorganizations/", err);
    }
});

module.exports = router;
