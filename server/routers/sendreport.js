const express = require("express");
const router = express.Router();
const db = require("../../db");

// router.post("/api/sendreport", async (req, res) => {
//     try {
//         const results = await db.insertReport(
//             req.session.userId,
//             req.body.fields.who,
//             req.body.fields.what,
//             req.body.fields.when,
//             req.body.fields.why,
//             req.body.fields.longitude,
//             req.body.fields.latitude
//         );
//         res.json(results);
//     } catch (err) {
//         console.log("Error in get /user db query: ", err);
//     }
// });

router.get("/getdrafts/", async (req, res) => {
    try {
        const results = await db.getDrafts(req.session.userId);
        res.json(results.rows);
    } catch (err) {
        console.log("Error in get /getdrafts/", err);
    }
});

module.exports = router;
