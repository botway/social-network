const db = require("./db").db;

const createUser = function(first, last, email, hashedPw) {
    const q = `
        INSERT INTO registered_users
        (first_name, last_name, email, password)
        VALUES
        ($1,$2,$3,$4)
        RETURNING id, first_name,last_name, email;
    `;

    const params = [
        first || null,
        last || null,
        email || null,
        hashedPw || null
    ];

    return db
        .query(q, params)
        .then(results => {
            return results.rows[0];
        })
        .catch(err => {
            console.log(err.message);
        });
};

const getUser = function(email) {
    const q = `
        SELECT first_name,
        last_name,
        registered_users.id,
        password
        FROM registered_users
        WHERE email = $1;
    `;
    const params = [email || null];

    return db
        .query(q, params)
        .then(results => {
            return results.rows[0];
        })
        .catch(err => {
            console.log(err.message);
        });
};

const getUserById = function(id) {
    const q = `
        SELECT first_name,
        last_name,
        registered_users.id,
        images.url AS imgUrl
        FROM registered_users
        FULL OUTER JOIN images
        ON registered_users.id = images.uid
        WHERE registered_users.id = $1
        ORDER BY images.id DESC;
    `;
    const params = [id || null];

    return db
        .query(q, params)
        .then(results => {
            return results.rows[0];
        })
        .catch(err => {
            console.log(err.message);
        });
};

const saveImage = function(data) {
    const q = `
        INSERT INTO images
        (url, uid)
        VALUES
        ($1, $2)
        RETURNING url, uid;
    `;

    const params = [
        data.url,
        data.uid
    ];

    return db
        .query(q, params)
        .then(results => {
            return results.rows[0];
        })
        .catch(err => console.log(err.message));
};

module.exports={
    createUser,
    getUser,
    getUserById,
    saveImage
};
