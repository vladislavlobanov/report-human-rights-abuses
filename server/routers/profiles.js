const express = require("express");
const router = express.Router();
const db = require("../../db");
const bcrypt = require("../../bcrypt");

router.get("/checklink/", async (req, res) => {
    try {
        const results = await db.checkLink(req.query.id);

        if (results.rows.length == 1) {
            res.json({
                success: true,
                publicOrNot: results.rows[0].publicornot,
                id: results.rows[0].id,
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

router.post("/verify/", async (req, res) => {
    try {
        const { rows } = await db.getHashedCode(req.body.code);
        if (rows.length == 0) {
            return res.json({ success: false });
        } else {
            const comparison = await bcrypt.compare(
                req.body.code,
                rows[0].hashedcode
            );

            if (comparison == true) {
                const { rows: rowsData } = await db.getDraftsSent(
                    req.body.caseId
                );
                res.json(rowsData);
            } else {
                return res.json({ success: false });
            }
        }
    } catch (err) {
        console.log("Error in post /verify: ", err);
    }
});

router.get("/getreport/", async (req, res) => {
    try {
        const { rows: rowsData } = await db.getDraftsSent(req.query.caseId);
        res.json(rowsData);
    } catch (err) {
        console.log("Error in get /getreport/", err);
    }
});

router.get("/api/search-cases/:val", async (req, res) => {
    try {
        console.log(req.params.val);
        const results = await db.searchUsers(req.params.val);
        res.json(results.rows);
    } catch (err) {
        console.log("Error in post /api/search-users db query: ", err);
    }
});

router.get("/getmore", async (req, res) => {
    try {
        const results = await db.getMoreHeadlines(req.query.id);
        res.json(results.rows);
    } catch (err) {
        console.log("Error in get /getmore db query: ", err);
    }
});

router.get("/getfeed", async (req, res) => {
    try {
        const results = await db.getLastTenHeadlines();
        res.json(results.rows);
    } catch (err) {
        console.log("Error in get /getfeed db query: ", err);
    }
});

module.exports = router;
