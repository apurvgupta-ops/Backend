const User = require("../models/user");
const { validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressjwt = require("express-jwt");

exports.signUp = (req, res) => {
  // console.log("REQ BODY:", req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "cant able to save user",
      });
    }
    res.json({
      name: user.name,
      lastname: user.lastname,
      id: user._id,
    });
  });
};

exports.signIn = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      res.status(400).json({
        err: "email doesnt exist",
      });
    }
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "password do not match",
      });
    }

    //CREATE TOKEN
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    //SAVING THE TOKEN INTO COOKIE
    res.cookie("token", token, { expire: new Date() + 9999 });
    //SEND THE RESPONSE TO THE FRONT-END
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signOut = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User Signout sucessfully",
  });
};

//PROTECTED ROUTE(ACT AS A MIDDLEWARE BUT COMES FROM EXPRESSJWT)
exports.isSignedIn = expressjwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

//CUSTOM MIDDLEWARE
exports.isAuthenticate = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role == 0) {
    return res.status(403).json({
      error: "YOU ARE NOT ADMIN, ACESS DENIED",
    });
  }
  next();
};
