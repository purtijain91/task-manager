const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res, next) => {
  console.log("hii, i am in register controller")
  try {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
      res.status(400);
      throw new Error('Please add all fields');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    console.log("user", userExists);

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("req.bodyy", email, password)
    const user = await User.findOne({ email });
    console.log("user", user)

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
