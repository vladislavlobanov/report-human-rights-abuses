var spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/reporthra"
);

module.exports.registration = (first, last, email, password) => {
    return db.query(
        `INSERT INTO users (first, last, email, hashed_password) VALUES ($1,$2,$3,$4) RETURNING id;`,
        [first, last, email, password]
    );
};

module.exports.findUser = (email) => {
    return db.query(
        `SELECT hashed_password, id FROM users
        WHERE email = ($1);`,
        [email]
    );
};

module.exports.findUserById = (id) => {
    return db.query(
        `SELECT first, last, id, email FROM users
        WHERE id = ($1);`,
        [id]
    );
};

module.exports.insertReport = (
    userId,
    who,
    what,
    whenHappened,
    why,
    longitude,
    latitude,
    wherehappened
) => {
    return db.query(
        `INSERT INTO report (user_id, who, what, whenHappened, why, longitude, latitude, wherehappened) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id, who, what, whenHappened, why, longitude, latitude, timestamp, wherehappened;`,
        [
            userId,
            who,
            what,
            whenHappened + ":00'",
            why,
            longitude,
            latitude,
            wherehappened,
        ]
    );
};

module.exports.getDrafts = (userId) => {
    return db.query(
        `SELECT id, who, what, whenHappened, why, longitude, latitude, timestamp, wherehappened FROM report WHERE (user_id = $1 and (linkId IS NULL))
        ORDER BY whenHappened DESC;
        `,
        [userId]
    );
};

module.exports.getDraftsSent = (reportId) => {
    return db.query(
        `SELECT id, who, what, whenHappened, why, longitude, latitude, timestamp, wherehappened FROM report WHERE (linkId = $1)
        ORDER BY whenHappened DESC`,
        [reportId]
    );
};

module.exports.insertLinks = (
    userId,
    headline,
    link,
    code,
    hashedCode,
    publicBoolean
) => {
    return db.query(
        `INSERT INTO links (user_id, headline, link, code, hashedCode, publicOrNot) VALUES ($1,$2, $3, $4, $5, $6) RETURNING id, timestamp, headline, publicOrNot;`,
        [userId, headline, link, code, hashedCode, publicBoolean]
    );
};

module.exports.updateLinksReport = (link, userId) => {
    return db.query(
        `UPDATE report SET linkId = ($1) WHERE (user_id = ($2) AND (linkId IS NULL));`,
        [link, userId]
    );
};

module.exports.getOrganizations = () => {
    return db.query(`SELECT name, email FROM organizations;`);
};

module.exports.checkLink = (link) => {
    return db.query(
        `SELECT id, link, publicOrNot FROM links
        WHERE (link = ($1) OR id::TEXT = ($1));`,
        [link]
    );
};

module.exports.getHashedCode = (code) => {
    return db.query(
        `SELECT hashedcode, user_id FROM links
        WHERE code = ($1);`,
        [code]
    );
};

module.exports.getLastTenHeadlines = () => {
    return db.query(`
        SELECT links.id, links.user_id, links.headline, links.timestamp, users.first, users.last, users.email
        FROM links
        JOIN users ON users.id = links.user_id
        WHERE (publicOrNot = TRUE)
        ORDER BY timestamp DESC
        LIMIT 2;
    `);
};

module.exports.getMoreHeadlines = (id) => {
    return db.query(
        `
        SELECT links.id, links.user_id, links.headline, links.timestamp, users.first, users.last, users.email,
        (SELECT links.id FROM links WHERE (publicOrNot = TRUE) ORDER BY id ASC LIMIT 1) AS "lowestId" FROM links
        JOIN users ON users.id = links.user_id
        WHERE (publicOrNot = TRUE AND links.id < $1) 
        ORDER BY timestamp DESC
        LIMIT 2;
    `,
        [id]
    );
};

module.exports.deleteDraft = (draftId) => {
    return db.query(
        `
        DELETE FROM report WHERE id = ($1);
    `,
        [draftId]
    );
};

module.exports.editDraft = (
    draftId,
    who,
    what,
    whenHappened,
    why,
    longitude,
    latitude,
    wherehappened
) => {
    return db.query(
        `UPDATE report SET who = ($2), what = ($3), whenHappened = ($4), why = ($5), longitude = ($6), latitude = ($7), wherehappened = ($8) WHERE id = ($1) RETURNING id, who, what, whenHappened, why, longitude, latitude, timestamp, wherehappened;`,
        [
            draftId,
            who,
            what,
            whenHappened + ":00'",
            why,
            longitude,
            latitude,
            wherehappened,
        ]
    );
};

module.exports.searchUsers = (val) => {
    return db.query(
        `
        SELECT DISTINCT links.id, links.user_id, links.headline, links.timestamp, users.first, users.last, users.email
        FROM links
        JOIN users ON users.id = links.user_id
        JOIN report ON links.id = report.linkId
        WHERE (links.publicOrNot = TRUE) AND (report.who || ' ' || report.what || ' ' || report.whenHappened || ' ' || report.why || ' ' || report.whereHappened || ' ' || links.headline || ' ' || users.first || ' ' || users.last) ILIKE $1
        ORDER BY timestamp DESC
        LIMIT 5;
    `,
        ["%" + val + "%"]
    );
};
