const express = require('express');
const troc = require('../model/modeltroc');
const router = express.Router();

router.route('/:troc_id')
    .get(function(req,res) {
        //Mongoose prévoit une fonction pour la recherche d'un document par son identifiant
        troc.findById(req.params.troc_id, function (err, r) {
            if (err)
                res.send(err);
            res.json({message: r});
        });
    })
    .put(function(req,res){
        // On commence par rechercher la piscine souhaitée
        troc.findById(req.params.troc_id, function(err, r) {
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
        troc.deleteOne({_id: req.params.troc_id}, function(err, r){
            if (err){
                res.send(err);
            }
            res.json({message:"Bravo,troc supprimée"});
        });
    });
router.route('/')
// J'implémente les méthodes GET, PUT, UPDATE et DELETE
// GET
    .get(function(req,res){
        troc.find({}, function (err, r) {
            if (err) {
                return handleError(err);
            }
            else {
                res.json({message : r, methode : req.method});
            }
        });
    })
    //POST
    .post(function(req,res){
        troc.create({ metier: req.body.metier, description: req.body.description }, function (err, r) {
            if (err) {
                return handleError(err);
            }
            else {
                res.json({message : "Ajout d'un un nouveau troc à la liste",
                    metier : req.body.metier,
                    description : req.body.description});
                // saved!
            }
        });

    })
router.route('/metier/:troc_metier')
    .get(function(req,res){
        troc.find({metier: req.params.troc_metier}, function (err, r) {
            if (err) {
                return handleError(err);
            }
            else {
                res.json({message : r, methode : req.method});
            }
        });
    });
module.exports = router;
