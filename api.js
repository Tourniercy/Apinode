//L'application requiert l'utilisation du module Express.
//La variable express nous permettra d'utiliser les fonctionnalités du module Express.
let express = require('express');
let bcrypt = require('bcryptjs');
let passport = require('passport');
// Nous définissons ici les paramètres du serveur.
let hostname = 'localhost';
let port = 3000;
let mongoose = require('mongoose');
let options = { useNewUrlParser: true,useUnifiedTopology: true  } ;
//URL de notre base
let urlmongo = "mongodb://root:password@localhost:27017/mongo";
// Nous connectons l'API à notre base de données
mongoose.connect(urlmongo, options);
mongoose.set('useCreateIndex', true);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur lors de la connexion'));
db.once('open', function (){
    console.log("Connexion à la base OK");
});
let trocSchema = mongoose.Schema({
    id : Number,
    metier: String,
    description: String
},{ collection : 'trocs' });
let userSchema = mongoose.Schema({
    email : {
        type    : String,
        required : true,
        unique  : true,
        match   : /^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/
    },
    password : {
        type    : String,
        required : true
    },
    password2 : {
        type    : String,
        required : false
    },
    registration : {
        type    : Date,
        default  : Date.now
    }
},{ collection : 'users' });
let Troc = mongoose.model('troc', trocSchema);
let User = mongoose.model('user',userSchema);
// Nous créons un objet de type Express.
let app = express();
//Afin de faciliter le routage (les URL que nous souhaitons prendre en charge dans notre API), nous créons un objet Router.
//C'est à partir de cet objet myRouter, que nous allons implémenter les méthodes.
let myRouter = express.Router();
//Créerun objet de type body-parser
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
myRouter.route('/')
// all permet de prendre en charge toutes les méthodes.
    .all(function(req,res){
        res.json({message : "Bienvenue sur l'API ", methode : req.method});
        // CODE
    });
// Je vous rappelle notre route (/trocs).
myRouter.route('/trocs')
// J'implémente les méthodes GET, PUT, UPDATE et DELETE
// GET
    .get(function(req,res){
        Troc.find({}, function (err, r) {
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
        Troc.create({ metier: req.body.metier, description: req.body.description }, function (err, r) {
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
//route vers trocs id
myRouter.route('/trocs/:troc_id')
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
myRouter.route('/trocs/metier/:troc_metier')
    .get(function(req,res){
        Troc.find({metier: req.params.troc_metier}, function (err, r) {
            if (err) {
                return handleError(err);
            }
            else {
                res.json({message : r, methode : req.method});
            }
        });
    });




myRouter.route('/user/register/')
    .post(function(req,res){
        const {email, password, password2} = req.body;
        let errors = [];

        if (!email || !password || !password2) {
            errors.push({msg: 'Remplir tous les champs'})
        }
        if (password !== password2) {
            errors.push({msg: 'Les mots de passe ne correspondent pas'})
        }
        if (password.length < 6) {
            errors.push({msg : 'Mot de passe trop court'})
        }
        if (errors.length > 0) {
            res.json({message : errors});
        } else {
            User.findOne({email : email}, function (err, r) {
                if (r) {
                    res.json({message : 'Cet utilisateur existe deja'});
                }
                else {
                    const newUser = new User({
                        email,
                        password
                    });
                    //Hash password
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser
                                .save()
                                .then(user => {
                                    res.json({message : 'Utilisateur crée'});
                                })
                                .catch(err => console.log(err));
                        });
                    });
                }

            })
        }
    });




// Nous demandons à l'application d'utiliser notre routeur
app.use(myRouter);
// Démarrer le serveur
app.listen(port, hostname, function(){
    console.log("Mon serveur fonctionne sur http://"+ hostname +":"+port);
});





