const mongoose = require('mongoose')

let trocSchema = mongoose.Schema({
    id : Number,
    metier: String,
    description: String
},{ collection : 'trocs' });
const troc = mongoose.model('troc',trocSchema);

module.exports = troc;
