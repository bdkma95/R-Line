const http = require('http');
const https = require('https');
const fs = require('fs');
const helmet = require('helmet');
const airNextTokenRouter = require('./routes/airNextTokenController');
const usersRouter = require('./routes/userController');
const nodeRouter = require('./routes/nodeAccessController');
const express = require('express');
const session = require('express-session');
var cors = require('cors');

const MONGO_URL = 'mongodb://localhost:27017/'
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

//mongoose.connect('mongodb://localhost:27017') // Connexion au localhost 
mongoose.connect(MONGO_URL) // Connexion localhost docker
    .then(() => require('./conf/seed.js')) // Données d'initialisation qui va créer et remplir seulement les données seulement si elles sont vides. 
    .catch(console.error);

const passport = require('./middleware/passport');
//self signed certificat and key to pass our server in https

const options = {
    key: fs.readFileSync('./cert/selfsigned.key'),
    cert: fs.readFileSync('./cert/selfsigned.crt')
};

//instance express
const server = express();

//configuration de helmet pour modifier les headers envoyé
server.use(helmet());
server.disable('x-powered-by');

// configuration de express-session pour securiser nos cookies
server.set('trust proxy', 1) // trust first proxy
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

var expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
server.use(session({
    secret: '41rN3xT',
    name: 'session',
    keys: ['key1', 'key2'],
    cookie: {
        secure: true,
        httpOnly: true,
        domain: 'localhost',
        expires: expiryDate
    }, resave: true,
    saveUninitialized: true
}));

const corsOpts = {
    origin: ['http://localhost:3000','http://localhost:3005'],
    methods: [
        'GET',
        'POST',
        'PUT',
        'DELETE',
        'OPTIONS'
    ],
    allowedHeaders: [
        'Content-Type',
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Methods",
        "Access-Control-Allow-Orgin"
    ],
};

server.use(cors(corsOpts));

server.use(passport.initialize());
server.use(passport.session());

server.get('/', (req, res) => {
    res.status(200).json("Bienvenu sur l'API User AirNext Dev")
})
server.use('/node', nodeRouter)

server.use('/airNextTokenList', airNextTokenRouter)

server.use('/users', usersRouter)

//http.createServer(server).listen(8080);
https.createServer(options, server).listen(8080);