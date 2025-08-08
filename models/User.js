const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    ad: { type: String, required: true },
    soyad: { type: String, required: true },
    gmail: { type: String, required: true, unique: true },
    dogumTarihi: { type: Date, required: true },
    il: { type: String, required: true },
    ilce: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
