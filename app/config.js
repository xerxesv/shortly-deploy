var mongoose = require('mongoose');
console.log('Connecting to mongodb');

if(process.env.NODE_ENV === 'production'){
  mongoose.connect('mongodb://mongo:mongo@ds040888.mongolab.com:40888/MongoLab2');
  console.log("connecting to mongo labs");
} else {
  mongoose.connect('mongodb://localhost/shortlydb');
}

var db = {};

console.log('Making url schema');
db.urlSchema = new mongoose.Schema({
  url:  String,
  base_url: String,
  code:   String,
  title: String,
  visits: {type: Number, default: 0}
});

console.log('Making user schema');
db.userSchema = new mongoose.Schema({
  username:  String,
  password: String
});

db.mongoose = mongoose;

module.exports = db;

// var Bookshelf = require('bookshelf');
// var path = require('path');

// var db = Bookshelf.initialize({
//   client: 'sqlite3',
//   connection: {
//     host: '127.0.0.1',
//     user: 'your_database_user',
//     password: 'password',
//     database: 'shortlydb',
//     charset: 'utf8',
//     filename: path.join(__dirname, '../db/shortly.sqlite')
//   }
// });

// db.knex.schema.hasTable('urls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('urls', function (link) {
//       link.increments('id').primary();
//       link.string('url', 255);
//       link.string('base_url', 255);
//       link.string('code', 100);
//       link.string('title', 255);
//       link.integer('visits');
//       link.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// db.knex.schema.hasTable('users').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('users', function (user) {
//       user.increments('id').primary();
//       user.string('username', 100).unique();
//       user.string('password', 100);
//       user.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// module.exports = db;