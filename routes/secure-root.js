const express = require('express');
const router = express.Router();
const user = require('../model/model');

//Lets say the route below is very sensitive and we want only authorized users to have access

//Displays information tailored according to the logged in user
router.get('/profile', (req, res, next) => {
    //We'll just send back the user details and the token
    res.json({
        message : 'You made it to the secure route',
        user : req.user,
        token : req.body.secret_token
    })
});
router.get('/', (req, res, next) => {
    //We'll just send back the user details and the token
    user.find({}, function (err, r) {
        if (err) {
            return handleError(err);
        }
        else {
            res.json({message : r, methode : req.method});
        }
    }).select({ "email": 1, "_id": 1});
});


module.exports = router;
