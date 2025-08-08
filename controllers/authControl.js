const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const register = async (req, res) => {
  const { ad, soyad, gmail, dogumTarihi, il, ilce, password } = req.body;

  try {
    const existingUser = await User.findOne({ gmail });
    if (existingUser)
      return res.status(400).json({ message: "Bu Gmail zaten kayıtlı." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      ad,
      soyad,
      gmail,
      dogumTarihi,
      il,
      ilce,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Kayıt başarılı" });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
};

const login = async (req, res) => {
  const { gmail, password } = req.body;

  try {
    const user = await User.findOne({ gmail });
    if (!user)
      return res.status(400).json({ message: "Gmail veya şifre yanlış" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Gmail veya şifre yanlış" });

    const token = jwt.sign(
      { id: user._id, gmail: user.gmail },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: { ad: user.ad, soyad: user.soyad, gmail: user.gmail },
    });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
};

module.exports = { register, login };
