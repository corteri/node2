const mg = require("mongoose");
const database  = 'mongodb://127.0.0.1/tdw';
exports.connection = function connection()
{
mg.connect(database, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mg.connection;
db.on('error',console.error.bind(console,'MongoDB connection error:'));
return db;
}