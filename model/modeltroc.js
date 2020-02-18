const mongoose = require('mongoose')

let trocSchema = mongoose.Schema({
    id : Number,
    metier: String,
    description: String
}, {versionKey: false}, { collection : 'trocs' });
const troc = mongoose.model('troc',trocSchema);

module.exports = troc;
