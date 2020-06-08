const mongoose = require("mongoose");

//conexao com mongoose
mongoose.connect("mongodb://localhost:27017/noderest", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}).then(() => {console.log('DB connection successful! (2/2)');

}).catch((err) => {
  console.log("DataBase Connection Error " + err);
})

mongoose.Promise = global.Promise;

module.exports = mongoose;




