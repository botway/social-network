const express = require('express');
const app = express();
const compression = require('compression');
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");

const { checkPassword, hashPassword } = require("./pass");
const { createUser, getUser } = require("./queries");

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
