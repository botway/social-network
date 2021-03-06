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

const server = require('http').Server(app);
const io = require('socket.io')(server, { origins: 'localhost:8080' });

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
    delFriendshipDB,
    getFriendsAndWannabesDB,
    getUsersByIdsDB,
    getChatMessages,
    saveChatMessage,
    searchUsersDB,
    getWallPostsDB,
    saveWallPostDB
} = require("./queries");

app.use(compression());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);

io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

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

app.get("/searchusers", async (req, res) => {
    const data = await searchUsersDB(req.query.searchStr);
    res.json(data);
});

app.get("/getwallposts", async (req, res) => {
    console.log(req.query);
    try{
        const data = await getWallPostsDB(req.query.userId);
        res.json(data);
    } catch(e){
        console.log(e.error.message);
    }
});

app.post("/savewallpost", async (req, res) => {
    try{
        await saveWallPostDB(req.body.data);
        res.json({postSaved: true});
    } catch(e){
        console.log(e.error.message);
    }
});

app.get("/user", async (req, res) => {
    const data = await getUserById(req.session.user.id);
    res.json(data);
});

app.get("/userbyid", async (req, res) => {
    const data = await getUserById(req.query.id);
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

app.get("/getfriends", async (req, res) => {
    try {
        const results = await getFriendsAndWannabesDB(req.session.user.id);
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
    const data = {
        sender_id: req.session.user.id,
        receiver_id: req.body.receiver_id
    };
    try {
        const results = await delFriendshipDB(data);
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

server.listen(8080, function() {
    console.log("Listening on 8080.");
});

/////////////// socket.io

let onlineUsers = [];
io.on('connection', function(socket) {
    if (!socket.request.session || !socket.request.session.user) {
        return socket.disconnect(true);
    }
    const currentUser = {
        ...socket.request.session.user
    };

    let joined = onlineUsers.findIndex(u => u.userId == currentUser.id);

    onlineUsers.push({
        userId: socket.request.session.user.id,
        socketId: socket.id
    });

    let ids = onlineUsers.map(user => {
        return user.userId;
    });
    getUsersByIdsDB(ids).then(results => {
        socket.emit("onlineUsers", results);
    });

    joined == -1 && socket.broadcast.emit("userJoined", currentUser);

    (async function getMessages () {
        try{
            let results = await getChatMessages();
            socket.emit("storedChatMessages", results);
        }catch(e){
            console.log(e.error.message);
        }
    })();

    socket.on("chatMessage", async message => {
        socket.broadcast.emit("newChatMessage", message);
        try{
            await saveChatMessage(message);
        }catch(e){
            console.log(e.error.message);
        }
    });

    socket.on('disconnect', function() {
        onlineUsers = onlineUsers.filter(user => (user.socketId != socket.id));
        let left = onlineUsers.findIndex(u => u.userId == currentUser.id);
        left == -1 && io.sockets.emit('userLeft', currentUser);
    });
});
