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
    if(req.url == "/" && !req.session.user){
        res.redirect("/welcome");
    }
    res.sendFile(__dirname + '/index.html');
});

app.get("/welcome",(req,res)=>{
    if(req.session.user){
        res.redirect("/");
    }
});

app.post("/register", (req, res) => {
    console.log("REG", req.body);
    hashPassword(req.body.password).then(hash => {
        createUser(req.body.firstName, req.body.lastName, req.body.email, hash)
            .then(results => {
                req.session.user = results;
                res.json({
                    success:true
                });
            })
            .catch(err => {
                // req.session.message = err.message;
                // res.redirect("/register");
                res.json({
                    success:false
                });
                console.log("register", err.message);
            });
    });
});

app.listen(8080, function() {
    console.log("I'm listening.");
});
