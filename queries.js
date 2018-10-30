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
        bio,
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
        RETURNING url, uid, id;
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

const delImage = function(id) {
    const q = `
        DELETE FROM images
        WHERE id =$1;
    `;
    return db
        .query(q, [id])
        .then(() => {
            console.log("img was deleted from db");
        })
        .catch(err => console.log(err.message));
};

const saveBioDB = function(data) {
    const q = `
        UPDATE registered_users
        SET bio = $2
        WHERE id = $1
        RETURNING bio;
    `;

    const params = [
        data.id,
        data.bio
    ];

    return db
        .query(q, params)
        .then(results => {
            return results.rows[0];
        })
        .catch(err => console.log(err.message));
};

const reqFriendshipDB = function(data){
    const q = `
        INSERT INTO friendships
        (sender_id, receiver_id)
        VALUES
        ($1, $2)
        RETURNING sender_id, receiver_id, accepted;
    `;

    const params = [
        data.sender_id,
        data.receiver_id
    ];

    return db
        .query(q, params)
        .then(results => {
            return results.rows[0];
        })
        .catch(err => console.log(err.message));
};

const updFriendshipDB = function(data){
    const q = `
        UPDATE friendships
        SET accepted = true
        WHERE (receiver_id=$1 AND sender_id = $2)
        OR (sender_id=$1 AND receiver_id = $2)
        RETURNING receiver_id, sender_id, accepted;
    `;

    const params = [
        data.sender_id,
        data.receiver_id,
    ];

    return db
        .query(q, params)
        .then(results => {
            return results.rows[0];
        })
        .catch(err => console.log(err.message));
};

const getFriendshipDB = function(data){
    const q = `
        SELECT * FROM friendships
        WHERE (receiver_id=$1 AND sender_id = $2)
        OR (sender_id=$1 AND receiver_id = $2);
    `;

    const params = [
        data.sender_id,
        data.receiver_id,
    ];

    return db
        .query(q, params)
        .then(results => {
            return results.rows[0];
        })
        .catch(err => console.log(err.message));
};

const delFriendshipDB = function(id){
    const q = `
        DELETE FROM friendships
        WHERE id = $1;
    `;
    return db
        .query(q, [id])
        .then(() => {
            return {deleted:true};
        })
        .catch(err => console.log(err.message));
};



module.exports={
    createUser,
    getUser,
    getUserById,
    saveImage,
    delImage,
    saveBioDB,
    reqFriendshipDB,
    updFriendshipDB,
    getFriendshipDB,
    delFriendshipDB
};
