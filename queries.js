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
        SELECT first_name, last_name, registered_users.id, bio,
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
        RETURNING sender_id, receiver_id, accepted, id;
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
        RETURNING receiver_id, sender_id, accepted, id;
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

const getFriendsAndWannabesDB = function(id) {
    const q = `
    SELECT registered_users.id, first_name, last_name, accepted, images.url as image
    FROM friendships
    JOIN registered_users
    ON (accepted = false AND receiver_id = $1 AND sender_id = registered_users.id)
    OR (accepted = true AND receiver_id = $1 AND sender_id = registered_users.id)
    OR (accepted = true AND sender_id = $1 AND receiver_id = registered_users.id)
    FULL OUTER JOIN images
    ON registered_users.id = images.uid
    WHERE registered_users.id IS NOT null
    ORDER BY images.id DESC;
`;

    return db
        .query(q, [id])
        .then(results => {
            return results.rows;
        })
        .catch(err => {
            console.log(err.message);
        });
};

const delFriendshipDB = function(data){
    const q = `
        DELETE FROM friendships
        WHERE (receiver_id=$1 AND sender_id = $2)
        OR (sender_id=$1 AND receiver_id = $2);
    `;

    const params = [
        data.sender_id,
        data.receiver_id,
    ];

    return db
        .query(q, params)
        .then(() => {
            return { deleted:true };
        })
        .catch(err => console.log(err.message));
};

function getUsersByIdsDB(arrayOfIds) {
    const q = `
        SELECT id, first_name, last_name
        FROM registered_users
        WHERE id = ANY($1)
    `;
    return db
        .query(q, [arrayOfIds])
        .then( results => {
            return results.rows;
        })
        .catch(err => console.log(err.message));
}
function getChatMessages (){
    const q = `
        SELECT * FROM chat
        LIMIT 50;
    `;
    return db
        .query(q)
        .then( results => {
            return results.rows;
        })
        .catch(err => console.log(err.message));

}
function saveChatMessage(data){
    const q = `
        INSERT INTO chat
        (uid, first_name, last_name, image, message)
        VALUES
        ($1, $2, $3, $4, $5)
        RETURNING message, first_name, last_name, uid;
    `;

    const params = [
        data.id,
        data.first_name,
        data.last_name,
        data.image,
        data.message
    ];

    return db
        .query(q, params)
        .then(results => {
            return results.rows[0];
        })
        .catch(err => console.log(err.message));
}

const searchUsersDB = function(str) {
    console.log(str);
    const q = `
    SELECT * FROM registered_users
    WHERE LOWER(first_name)::text LIKE $1
    OR LOWER(last_name)::text LIKE $1;
`;
    const params = [
        "%" + str +"%"
    ];
    return db
        .query(q, params)
        .then(results => {
            console.log(results.rows);
            return results.rows;
        })
        .catch(err => {
            console.log(err.message);
        });
};
function getWallPostsDB (userId){
    console.log(userId);
    const q = `
        SELECT * FROM wall_posts
        JOIN registered_users
        ON uid = registered_users.id
        WHERE uid = $1
        ORDER BY wall_posts.created_at DESC
        LIMIT 10;
    `;
    return db
        .query(q,[userId])
        .then( results => {
            console.log("sss", results.rows);
            return results.rows;
        })
        .catch(err => console.log(err.message));

}
function saveWallPostDB(data){
    console.log(data);
    const q = `
        INSERT INTO wall_posts
        (uid, message, authorId)
        VALUES
        ($1, $2, $3)
        RETURNING message, uid, created_at, authorId;
    `;

    const params = [
        data.userId,
        data.message,
        data.authorId
    ];

    return db
        .query(q, params)
        .then(results => {
            return results.rows[0];
        })
        .catch(err => console.log(err.message));
}
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
    delFriendshipDB,
    getFriendsAndWannabesDB,
    getUsersByIdsDB,
    getChatMessages,
    saveChatMessage,
    searchUsersDB,
    getWallPostsDB,
    saveWallPostDB
};
