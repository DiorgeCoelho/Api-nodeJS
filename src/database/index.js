 const mongoose = require('mongoose');
 const dotenv = require("dotenv");

  const mongoConnectionString = 'mongodb://localhost/noderest';

 mongoose.connect(mongoConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true, 
    useFindAndModify: false,
 }).then(()=>{
     console.log(`conexão com o banco de dados estabelecida`)
 }).catch(err=>{
     console.log(`db error ${err.message}`);
     process.exit(-1)
 })
 module.exports = mongoose;