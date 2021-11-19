var mongoose = require("mongoose");
const uuidv1 = require("uuid/v1");
const crypto = require("crypto");
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 32, trim: true },
    lastname: { type: String, required: true, maxlength: 32, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    encry_password: { type: String, required: true },
    purchases: { type: Array, default: [] },
    role: { type: Number, default: 0 },
    salt: { type: String },
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function (password) {
    (this._password = password),
      (this.salt = uuidv1()),
      (this.encry_password = this.securePassword(password));
  })
  .get(function () {
    return this.password;
  });

userSchema.methods = {
  authenticate: function (plainPassword) {
    return this.securePassword(plainPassword) === this.encry_password;
  },

  securePassword: function (plainPassword) {
    if (!plainPassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainPassword)
        .digest("hex");
    } catch (error) {
      return "";
    }
  },
};

module.exports = mongoose.model("User", userSchema);
