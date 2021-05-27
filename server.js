require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
const ObjectID = require("mongodb").ObjectID;
const { createIndexes } = require("./models/user");

// Connection string for MongoDB
const DbUri =
  "mongodb+srv://timotej:motovilec@usercontacts.2jycg.mongodb.net/UserContact?retryWrites=true&w=majority";
mongoose
  .connect(DbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log("connected to DB on port 4000");
    app.listen(4000);
  }) // We will be listening only if we are successfuly connected to DB
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());

app.post("/addcontact", authenticateToken, async (req, res) => {
  const newContact = {
    _id: new ObjectID(),
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };

  await User.findOneAndUpdate(
    { email: req.user.email },
    { $addToSet: { contacts: newContact } },
    (err, response) => {
      if (err) throw err;
      res.send(newContact);
    }
  );
});

app.get("/contacts", authenticateToken, (req, res) => {
  User.findOne({ email: req.user.email })
    .then((result) => {
      console.log(result._doc.contacts);
      res.send(result._doc.contacts);
    })
    .catch((err) => res.status(err).send());
});

app.put("/contacts/:id", authenticateToken, async (req, res) => {    // edit contact
  const mail = req.body.email;

  await User.findOneAndUpdate(
    { email: mail.toLowerCase(), "contacts._id": req.params.id },
    {
      $set: {
        "contacts.$.name": req.body.name,
        "contacts.$.email": req.body.email,
        "contacts.$.phone": req.body.phone,
      },
    },
    { multi: false }
  )
    .then((result) => {
      console.log("Result ... " + result);
      res.send(result);
    })
    .catch((err) => console.log(err));
});

app.delete("/contacts/:id", authenticateToken, (req, res) => {
  const mail = req.user.email;
  User.findOneAndUpdate(
    { email: mail.toLowerCase() },
    { $pull: { contacts: { _id: req.params.id } } },
    { multi: false }
  ).then((result) => res.status(200).send(result));
});

app.get("/test", authenticateToken, (req, res) => {
  console.log("Success !!");
  console.log(req.user.name);
});

function authenticateToken(req, res, next) {
  // use this to autenticate request with token
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
