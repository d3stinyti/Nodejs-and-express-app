
// essentials
const express = require('express')
const bodyParser = require('body-parser')
const encrypt = require('mongoose-encryption')


const mongoose = require('mongoose')
const app = express()

app.use(express.static('public'));


app.use(bodyParser.urlencoded({
  extended: true
}));

// MONGODB CONNECTION
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true })
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
const db = mongoose.connection
db.on('error', (err) => {
    console.log(err)
})
db.once('open', () => {
    console.log('Connected to MongoDB!')
} )

// USER SCHEMA W/ ENCRYPT PASSWORD
const userSchema = new mongoose.Schema ({
  name: String,
  surname: String,
  userID: String,
  email: String,
  password: String

});

const secret = "secretPass."
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

// USER MODEL
const User = new mongoose.model('User', userSchema);

// HOMEPAGE ROUTE
app.get('/', function (req, res){
  res.sendFile(__dirname + "/login.html");

});

// LOGIN ROUTE
app.get('/login', function (req, res){
  res.sendFile(__dirname + "/login.html");
});

app.post('/login', function(req, res){
 const userID = req.body.userID;
 const password = req.body.password;

 User.findOne({ userID: userID}, function(err, foundUser){
  if (err) {
    console.log(err);
  } else {
    if (foundUser){
      if (foundUser.password === password){
        res.sendFile(__dirname + "/homepage.html"); // redirect to secrets page
      }
    } 
  }
 });
});

// REGISTER ROUTE
app.get('/register', function (req, res){
  res.sendFile(__dirname + "/register.html");

});

// DB FOR NEW USER
app.post('/register', function(req, res){
  const newUser = new User({
  name: req.body.name,
  surname: req.body.surname,
  userID: req.body.userID,
  email: req.body.email,
  password: req.body.password

  });

  newUser.save(function(err){
    if (err) {
      console.log(err);
    } else {
      res.sendFile(__dirname + "/login.html"); // redirect to log-in page
    }
  });

});


// puclic assets for express module
app.use(express.static(__dirname + '/public'))