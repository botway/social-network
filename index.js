const express = require('express');
const app = express();
const compression = require('compression');
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const { upload, delImg } = require("./s3");
const { s3Url } = require("./config.json");

const { checkPassword, hashPassword } = require("./pass");
const { createUser,
    getUser,
    saveImage,
    getUserById,
    delImage,
    saveBioDB,
    reqFriendshipDB,
    updFriendshipDB,
    getFriendshipDB,
    delFriendshipDB
} = require("./queries");

app.use(compression());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

if (process.env.NODE_ENV != 'production') {
    app.use(
        '/bundle.js',
        require('http-proxy-middleware')({
            target: 'http://localhost:8081/'
        })
    );
} else {
    app.use('/bundle.js', (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.get("/user", async (req, res) => {
    const data = await getUserById(req.session.user.id);
    res.json(data);
});

app.get("/userprofile", async (req, res) => {
    if(req.session.user.id == req.query.id){
        res.json({redirect:true});
    } else {
        const data = await getUserById(req.query.id);
        if(!data){
            res.json({redirect:true});
        } else {
            res.json(data);
        }
    }
});

app.get("/reqfriendship", async (req, res) => {
    const data = {
        sender_id: req.session.user.id,
        receiver_id: req.query.receiver_id
    };
    try {
        const results = await reqFriendshipDB(data);
        res.json(results);
    } catch (e){
        console.log(e.error.message);
    }
});

app.get("/getfriendship", async (req, res) => {
    const data = {
        sender_id: req.session.user.id,
        receiver_id: req.query.receiver_id
    };
    try {
        const results = await getFriendshipDB(data);
        res.json(results);
    } catch (e){
        console.log(e.error.message);
    }
});

app.post("/acceptfriendship", async (req, res) => {
    const data = {
        sender_id: req.session.user.id,
        receiver_id: req.body.receiver_id
    };
    try {
        const results = await updFriendshipDB(data);
        res.json(results);
    } catch (e){
        console.log(e.error.message);
    }
});

app.post("/endfriendship", async (req, res) => {
    try {
        const results = await delFriendshipDB(req.body.id);
        res.json(results);
    } catch (e){
        console.log(e.error.message);
    }
});


app.get('*', function(req, res) {
    if(req.url == "/welcome" && req.session.user){
        res.redirect("/");
    } else if (
        req.url == "/" && !req.session.user
    ){
        res.redirect("/welcome");
    }

    res.sendFile(__dirname + '/index.html');
});

app.post("/upload", uploader.single("file"), upload, function(req, res) {
    console.log(req.body, req.file);
    const imgUrl = s3Url + req.file.filename;

    const data = {
        url: imgUrl,
        uid: req.body.uid
    };

    saveImage(data)
        .then(results => {
            res.json(results);
        })
        .catch(err => {
            console.log(err.message);
        });
});

app.post("/deleteimg", delImg, (req, res) => {
    delImage(req.body.id).then(() => {
        console.log("image and comments were wiped out");
        res.json({ deleted: true });
    }).catch(err => {
        console.log(err.message);
    });
});

app.post("/savebio", (req, res) => {
    saveBioDB(req.body).then((results) => {
        console.log("bio was saved");
        res.json(results);
    }).catch(err => {
        console.log(err.message);
    });
});

app.post("/logout", (req,res) => {
    req.session = null;
    res.redirect("/welcome");
});

app.post("/register", (req, res) => {
    hashPassword(req.body.password).then(hash => {
        createUser(req.body.firstName, req.body.lastName, req.body.email, hash)
            .then(results => {
                req.session.user = results;
                res.json({
                    success:true
                });
            })
            .catch(err => {
                res.json({
                    success:false
                });
                console.log("register", err.message);
            });
    });
});

app.post("/login", (req, res) => {
    getUser(req.body.email).then(user => {
        checkPassword(req.body.password, user.password)
            .then(match => {
                if (match) {
                    req.session.user = {
                        id: user.id,
                        first_name: user.first_name,
                        last_name: user.last_name
                    };
                    res.json({ success: true });
                } else {
                    res.json({
                        success:false,
                        message: "invalid password or email"
                    });
                }
            }).catch(err => {
                console.log(err.message);
                res.json({
                    success: false,
                    message: "invalid password or email"
                });
            });
    }).catch(err => {
        console.log(err.message);
        res.json({
            success: false,
            message: "invalid password or email"
        });
    });
});

app.listen(8080, function() {
    console.log("I'm listening.");
});
