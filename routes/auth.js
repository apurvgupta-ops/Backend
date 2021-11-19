const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { signOut, signUp, signIn, isSignedIn } = require("../controllers/auth");

//ROUTER
router.post(
  "/signup",
  [
    body("name", "Please enter the name").isLength({ min: 3 }),
    body("email", "Please enter the email").isEmail(),
    body("password", "Please enter the password more then 3 words").isLength({
      min: 3,
    }),
  ],
  signUp
);

router.post(
  "/signin",
  [
    body("email", "Please enter the email").isEmail(),
    body("password", "Please enter the password more then 3 words").isLength({
      min: 3,
    }),
  ],
  signIn
);

router.get("/signout", signOut);

// router.get("/test", isSignedIn, (req, res) => {
//   res.send("protected route ");
// });

//EXPORT
module.exports = router;
