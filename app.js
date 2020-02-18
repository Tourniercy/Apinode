const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();
const UserModel = require('./model/model');
mongoose.connect('mongodb+srv://trocServiceAdmin:root@cluster0-cjeps.mongodb.net/api?retryWrites=true&w=majority',{useCreateIndex: true,
    useNewUrlParser: true,useUnifiedTopology: true });

mongoose.connection.on('error', error => console.log(error) );
mongoose.Promise = global.Promise;

require('./auth/auth');
app.use( bodyParser.urlencoded({ extended : false }) );

const routes = require('./routes/routes.js');
const secureRoute = require('./routes/secure-root.js')
const secureRouteTroc = require('./routes/secure-troc-root.js')
app.use('/', routes);
//We plugin our jwt strategy as a middleware so only verified users can access this route
app.use('/user', passport.authenticate('jwt', { session : false }), secureRoute );
app.use('/troc', passport.authenticate('jwt', { session : false }), secureRouteTroc );

//Handle errors
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({ error : err });
});

app.listen(3000, () => {
    console.log('Server started')
});
