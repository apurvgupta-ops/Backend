const Category = require("../models/category");

//GET CATEGORY BY ID
exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "No category found",
      });
    }
    req.category = category;
    next();
  });
};

//CREATE CATEGORY
exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err) {
      res.status(400).json({
        err: "cant able to create category in db",
      });
    }
    res.json({ category });
  });
};

//GET ALL CATEGORIES
exports.getAllCategory = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err) {
      res.status(400).json({
        err: "There is no category",
      });
    }
    res.json(categories);
  });
};

//GET A CATEGORY
exports.getCategory = (req, res) => {
  return res.json(req.category);
};

//UPDATE CATEGORY
exports.updateCategory = (req, res) => {
  const category = req.category;
  category.name = req.body.name;
  category.save((err, updatedCategory) => {
    if (err) {
      res.status(400).json({
        err: "Failed to update",
      });
    }
    res.json(updatedCategory);
  });
};

//DELETE CATEGORY
exports.deleteCategory = (req, res) => {
  const category = req.category;
  category.remove((err, category) => {
    if (err) {
      res.status(400).json({
        err: "failed to delete",
      });
    }
    res.json({
      message: `successfully deleted ${category} category`,
    });
  });
};
