const express = require("express");
const router = express.Router();

const {
  getUserById,
  getUser,
  updateUser,
  userPurchaseList,
  getAllUser,
} = require("../controllers/user");
const { isSignedIn, isAuthenticate, isAdmin } = require("../controllers/auth"); // for used as a middlewares and protected the routes
//PARAMETER ROUTE
router.param("userId", getUserById);

//READ ROUTE
router.get("/user/:userId", isSignedIn, isAuthenticate, getUser);
router.get(
  "/orders/user/:userId",
  isSignedIn,
  isAuthenticate,
  userPurchaseList
);
// router.get("/user", getAllUser);

//UPDATE ROUTE
router.put("/user/:userId", isSignedIn, isAuthenticate, updateUser);

module.exports = router;
