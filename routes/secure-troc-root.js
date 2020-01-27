const express = require('express');

const router = express.Router();

//Lets say the route below is very sensitive and we want only authorized users to have access

//Displays information tailored according to the logged in user
router.get('/profile', (req, res, next) => {
    //We'll just send back the user details and the token
    res.json({
        message : 'You made it to the secure route',
        user : req.user,
        token : req.query.secret_token
    })
});
router(':troc_id')
    .get(function(req,res) {
        //Mongoose prévoit une fonction pour la recherche d'un document par son identifiant
        Troc.findById(req.params.troc_id, function (err, r) {
            if (err)
                res.send(err);
            res.json({message: r});
        });
    })
    .put(function(req,res){
        // On commence par rechercher la piscine souhaitée
        Troc.findById(req.params.troc_id, function(err, r) {
            if (err){
                res.send(err);
            }
            // Mise à jour des données de la piscine
            r.metier = req.body.metier;
            r.description = req.body.description;
            r.save(function(err){
                if(err){
                    res.send(err);
                }
                // Si tout est ok
                res.json({message : 'Bravo, mise à jour des données OK'});
            });
        });
    })
    .delete(function(req,res){
        Troc.deleteOne({_id: req.params.troc_id}, function(err, r){
            if (err){
                res.send(err);
            }
            res.json({message:"Bravo,troc supprimée"});
        });
    });
module.exports = router;
