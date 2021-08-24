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
        `SELECT first, last, id FROM users
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
    latitude
) => {
    return db.query(
        `INSERT INTO report (user_id, who, what, whenHappened, why, longitude, latitude) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, who, what, whenHappened, why, longitude, latitude, timestamp;`,
        [userId, who, what, whenHappened, why, longitude, latitude]
    );
};

module.exports.getDrafts = (userId) => {
    return db.query(
        `SELECT id, who, what, whenHappened, why, longitude, latitude, timestamp FROM report WHERE (user_id = $1 and (linkId IS NULL));`,
        [userId]
    );
};

module.exports.getDraftsSent = (userId) => {
    return db.query(
        `SELECT id, who, what, whenHappened, why, longitude, latitude, timestamp FROM report WHERE (user_id = $1 and (linkId IS NOT NULL));`,
        [userId]
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
        `INSERT INTO links (user_id, headline, link, code, hashedCode, public) VALUES ($1,$2, $3, $4, $5, $6) RETURNING id;`,
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
        `SELECT link FROM links
        WHERE link = ($1);`,
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
