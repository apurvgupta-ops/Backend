const express = require("express");
const router = express.Router();

const {
  getCategoryById,
  createCategory,
  getAllCategory,
  getcategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/category");
const { getUserById } = require("../controllers/user");
const { isAdmin, isAuthenticate, isSignedIn } = require("../controllers/auth");

//PARAMS ROUTE
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

//ACTUAL ROUTES
router.post(
  "/category/create/:userId",
  isSignedIn,
  isAuthenticate,
  isAdmin,
  createCategory
);

router.get("/categories", getAllCategory);
router.get("/category/:categoryId", getcategory);

router.put(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticate,
  isAdmin,
  updateCategory
);

router.delete(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticate,
  isAdmin,
  deleteCategory
);

module.exports = router;
