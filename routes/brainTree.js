const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticate } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const { getToken, processPayment } = require("../controllers/brainTree");
router.param("userId", getUserById);

router.get("/payment/token/:userId", isSignedIn, isAuthenticate, getToken);

router.post(
  "/payment/braintree/:userId",
  isSignedIn,
  isAuthenticate,
  processPayment
);

module.exports = router;
