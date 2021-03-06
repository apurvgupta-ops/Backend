const express = require("express");
const router = express.Router();

const {
  getCategoryById,
  createCategory,
  getAllCategory,
  getCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/category");
const { getUserById } = require("../controllers/user");
const { isAdmin, isAuthenticate, isSignedIn } = require("../controllers/auth");

//PARAMS ROUTE
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

//ACTUAL ROUTES

//WRITE
router.post(
  "/category/create/:userId",
  isSignedIn,
  isAuthenticate,
  isAdmin,
  createCategory
);

//READ
router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategory);

//UPDATE
router.put(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticate,
  isAdmin,
  updateCategory
);

//DELETE
router.delete(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticate,
  isAdmin,
  deleteCategory
);

module.exports = router;
