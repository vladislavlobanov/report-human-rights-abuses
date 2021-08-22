const express = require("express");
const router = express.Router();
const db = require("../../db");
const bcrypt = require("../../bcrypt");

router.get("/user/id.json", function (req, res) {
    res.json({
        userId: req.session.userId,
    });
});

router.post("/api/register", (req, res) => {
    if (
        !req.body.first ||
        !req.body.last ||
        !req.body.email ||
        !req.body.password
    ) {
        return res.json({
            success: false,
            errMessage: "Please fill in all fields!",
        });
    }

    const emailFormat =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailFormat.test(req.body.email)) {
        return res.json({
            success: false,
            errMessage: "Please provide a valid email address",
        });
    }

    bcrypt
        .hash(req.body.password)
        .then((hashPwd) => {
            return db
                .registration(
                    req.body.first,
                    req.body.last,
                    req.body.email,
                    hashPwd
                )
                .then((results) => {
                    req.session.userId = results.rows[0].id;
                    res.json({ success: true });
                });
        })
        .catch((err) => {
            if (err.code == "23505") {
                res.json({
                    success: false,
                    errMessage:
                        `User associated with ` +
                        req.body.email +
                        ` already exists`,
                });
            } else {
                res.json({
                    success: false,
                    errMessage: "Something went wrong",
                });
            }
        });
});

router.post("/api/login", (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.json({
            success: false,
            errMessage: "Please fill in all fields!",
        });
    }

    const emailFormat =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailFormat.test(req.body.email)) {
        return res.json({
            success: false,
            errMessage: "Please provide a valid email address",
        });
    }

    db.findUser(req.body.email)
        .then((results) => {
            if (!results.rows[0]) {
                return res.json({
                    success: false,
                    errMessage:
                        "No user found associated with " + req.body.email,
                });
            }
            return bcrypt
                .compare(req.body.password, results.rows[0].hashed_password)
                .then((comparison) => {
                    if (comparison == false) {
                        res.json({
                            success: false,
                            errMessage: "Please provide a valid password",
                        });
                    } else {
                        req.session.userId = results.rows[0].id;
                        res.json({ success: true });
                    }
                });
        })
        .catch((err) => {
            console.log(err);
            res.json({
                success: false,
                errMessage: "Something went wrong",
            });
        });
});

router.get("/user", async (req, res) => {
    try {
        const results = await db.findUserById(req.session.userId);

        res.json({
            first: results.rows[0].first,
            last: results.rows[0].last,
            userId: results.rows[0].id,
        });
    } catch (err) {
        console.log("Error in get /user db query: ", err);
    }
});

module.exports = router;
