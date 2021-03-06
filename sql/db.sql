DROP TABLE IF EXISTS registered_users;

CREATE TABLE registered_users(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    url VARCHAR(300) NOT NULL,
    uid INT NOT NULL REFERENCES registered_users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat(
    id SERIAL PRIMARY KEY,
    message VARCHAR(9999) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    image VARCHAR(300),
    uid INT NOT NULL REFERENCES registered_users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wall_posts(s
    id SERIAL PRIMARY KEY,
    message VARCHAR(9999) NOT NULL,
    uid INT NOT NULL REFERENCES registered_users(id),
    authorId INT NOT NULL REFERENCES registered_users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO images (url, uid) VALUES (
    'http://s3.amazonaws.com/spicedling/quEXS59O1ZCb07vz5pyv_X4uuRcyUk3t.svg',
    28
);

ALTER TABLE registered_users
ADD COLUMN bio VARCHAR(1500);

ALTER TABLE wall_posts
ADD COLUMN authorId INT NOT NULL REFERENCES registered_users(id);
