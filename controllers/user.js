const User = require("../models/user");
const Order = require("../models/order");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "NO user found",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  req.profile.salt = undefined; //we can do pass empty string also ""
  req.profile.encry_password = undefined;
  return res.json(req.profile);
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          err: "You are not authorized for updating the info",
        });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      res.json(user);
    }
  );
};

exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.porfile._id })
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err) {
        return res.status(402).json({
          err: "No orders",
        });
      }

      return res.json(order);
    });
};

// exports.getAllUser = (req, res) => {
//   User.find().exec((err, user) => {
//     if (err || !user) {
//       res.status(402).json({
//         err: "No Users Found",
//       });
//     }
//     res.json(user);
//   });
// };
