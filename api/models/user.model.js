const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const phoneNumberSchema = new mongoose.Schema(
  {
    countryCode: { type: String, lowercase: true, required: true },
    dialCode: { type: String, required: true },
    number: { type: String, required: true },
    format: { type: String, required: true },
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, default: "" },
    zipCode: { type: String, required: true },
  },
  { _id: false, timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, uppercase: true, required: true },
    lastName: { type: String, uppercase: true, required: true },
    gender: {
      type: String,
      uppercase: true,
      required: true,
      enum: ["MALE", "FEMALE", "OTHER"],
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: addressSchema },
    phoneNumber: { type: phoneNumberSchema, required: true },
    isAdmin: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  if (update.password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
