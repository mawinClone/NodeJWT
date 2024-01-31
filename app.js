require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//register
app.post("/register", async (req, res) => {
  //register logic //get user -> validate -> encrypt password -> add to db -> create jwt

  try {
    const { username, email, password } = req.body;
    if (!(username && email && password)) {
      res.status(400).send("require all input");
    }
    console.log("email " , email);
     
    const oldUser = await User.findOne({email:email.toLowerCase()}); //check if user already exist by validate from db

    if (oldUser) {
      return res.status(409).send("already have this email");
    }

    console.log("older user", oldUser);

    encryptPassword = await bcrypt.hash(password, 10); //encrypt

    //create user in db
    const user = await User.create({
      username: username,
      email: email.toLowerCase(),
      password: encryptPassword,
    });

    const token = jwt.sign(
      //create token
      {
        user_id: user._id,
        email,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    user.token = token; //save user token
    res.status(401).json(user); // send new user
  } catch (err) {
    console.log(err);
  }
});

//login
app.post("/login", async (req, res) => {
  //login logic

  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      // validate
      res.status(400).send("require all input");
    }

    const user = await User.findOne({ email:email.toLowerCase() }); //check if user already exist by validate from db

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        //create token
        {
          user_id: user._id,
          email,
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      user.token = token; //save user token
      res.status(200).json(user);
    }
    console.log("User: ",user);

    res.status(400).send("invalid credential"); // cant login !!! wrong password or email ???
  } catch (err) {
    console.log("something error ?");
    console.log(err);
  }
});

module.exports = app;
