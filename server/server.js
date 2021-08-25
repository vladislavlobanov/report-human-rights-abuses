const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const secrets = require("./secrets");
const user = require("./routers/user");
const profiles = require("./routers/profiles");
const sendreport = require("./routers/sendreport");
const db = require("../db.js");

const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

const cookieSessionMiddleware = cookieSession({
    secret: secrets.cookiePwd,
    maxAge: 1000 * 60 * 60 * 24 * 14,
    sameSite: true,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
app.use(express.json());
app.use(compression());
app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use(user);
app.use(sendreport);
app.use(profiles);

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

io.on("connection", async function (socket) {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }
    const userId = socket.request.session.userId;
    console.log(`socket with the id ${socket.id} is now connected`);

    socket.on("disconnect", function () {
        console.log(`socket with the id ${socket.id} is now disconnected`);
    });

    socket.on("newDraft", async (data) => {
        try {
            console.log(data);
            const { rows } = await db.insertReport(
                userId,
                data.who,
                data.what,
                data.when,
                data.why,
                data.longitude,
                data.latitude,
                data.where
            );
            socket.emit("updateDrafts", rows);
        } catch (err) {
            console.log("Err in db insertReport socket", err);
        }
    });

    socket.on("editDraft", async (data) => {
        try {
            const results = await db.editDraft(
                data.draftId,
                data.who,
                data.what,
                data.when,
                data.why,
                data.longitude,
                data.latitude,
                data.where
            );

            socket.emit("updateEditedDraft", results.rows);
        } catch (err) {
            console.log("Err in db editDraft socket");
        }
    });

    socket.on("deleteDraft", async (data, secondarg) => {
        if (secondarg) {
            socket.emit("updateDraftsWDelete", data);
        } else {
            try {
                await db.deleteDraft(data);
                socket.emit("updateDraftsWDelete", data);
            } catch (err) {
                console.log("Err in deleteDraft server", err);
            }
        }
    });

    const { rows: headlinesRows } = await db.getLastTenHeadlines();
    socket.emit("lastHeadlines", headlinesRows);

    socket.on("newHeadline", (data) => {
        io.emit("updateHeadlines", data);
    });
});
