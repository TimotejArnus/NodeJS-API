require("dotenv").config();

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
const cors = require("cors");

// Connection string for MongoDB
const DbUri =
  "mongodb+srv://timotej:motovilec@usercontacts.2jycg.mongodb.net/UserContact?retryWrites=true&w=majority";
mongoose
  .connect(
    DbUri,
    { useNewUrlParser: true, useUnifiedTopology: true },
    { useFindAndModify: false }
  )
  .then((result) => {
    console.log("connected to DB on port 5000");
    app.listen(5000);
  }) // We will be listening only if we are successfuly connected to DB
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());

app.post("/register", async (req, res) => {
  const mail = req.body.email;
  User.findOne({ email: mail.toLowerCase() }, async function(err, result){
    if(result != null){
      res.sendStatus(400)
    } //user exist
    else{
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const mail = req.body.email;
        const user = new User({
          email: mail.toLowerCase(),
          pass: hashedPassword,
        });
    
        user
          .save()
          .then((result) => {
            res.sendStatus(201);
          })
          .catch((err) => {
            console.log(err);
          });
    
        res.status(201).send();
      } catch {
        res.status(500).send();
      }
    }
  }) // if user already exist return err
  
});

app.post("/login", async (req, res) => {
  const mail = req.body.email;
  User.findOne({ email: mail.toLowerCase() })
    .then((result) => {
      try {
        if (bcrypt.compare(req.body.password, result.pass)) {         

          const useremail = req.body.email;
          const user = { email: useremail };

          const accessToken = generateAccessToken(user);
          const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET); // TODO Not implemented

          res.json({ accessToken: accessToken, refreshToken: refreshToken });
        } else {
          res.send("Not Allowed");
        }
      } catch {
        res.status(500).send();
      }
    })
    .catch((err) => console.log(err));
});

app.delete("/logout", (req, res) => {
  // TODO
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "180m" });
}
