const express = require("express");
const router = express.Router();
const db = require("../../db");
const bcrypt = require("../../bcrypt");
const cryptoRandomString = require("crypto-random-string");
const ses = require("../ses");
const secrets = require("../secrets");

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

router.get("/api/logout", (req, res) => {
    req.session = null;
    res.sendStatus(200);
});

router.post("/api/password/reset/start", (req, res) => {
    const emailFormat =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailFormat.test(req.body.email)) {
        return res.json({
            success: false,
            errMessage: "Email address is not valid",
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
            } else {
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                return db.insertCode(req.body.email, secretCode).then(() => {
                    return ses.sendReset(secrets.email, secretCode).then(() => {
                        console.log("Email has been sent");
                        res.json({ success: true });
                    });
                });
            }
        })
        .catch((err) => {
            console.log(err);
            res.json({
                success: false,
                errMessage: "Something went wrong",
            });
        });
});

router.post("/api/password/reset/verify", (req, res) => {
    if (!req.body.code || !req.body.password) {
        return res.json({
            success: false,
            errMessage: "Please fill in all fields!",
        });
    }

    db.selectCodes(req.body.email)
        .then((results) => {
            if (results.rows.length == 0) {
                return res.json({
                    success: false,
                    errMessage:
                        "Code has expired. Please go back and start the process again",
                });
            } else {
                for (let i = results.rows.length - 1; i >= 0; i--) {
                    //checking if the last sent code is valid
                    if (results.rows[i].code === req.body.code) {
                        return bcrypt
                            .hash(req.body.password)
                            .then((hashPwd) => {
                                return db
                                    .updatePassword(req.body.email, hashPwd)
                                    .then(() => {
                                        res.json({ success: true });
                                    });
                            });
                    } else {
                        return res.json({
                            success: false,
                            errMessage: "Please enter the last code received",
                        });
                    }
                }
            }
        })
        .catch((err) => {
            console.log(err);
            res.json({
                success: false,
                errMessage: "Something went wrong",
            });
        });
});

module.exports = router;
