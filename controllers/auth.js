const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, name, password: hashedPassword });
    await user.save();
    res.status(201).json({
      message: 'User created',
      userId: user._id,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Could not find a user.' });
    }
    const { _id, password: hashedPassword } = user;
    const doMatch = await bcrypt.compare(password, hashedPassword);
    if (!doMatch) {
      return res.status(401).json({ message: 'Invalid password.' });
    }
    const token = jwt.sign({
        email,
        userId: _id.toString(),
      },
      'thisSecretShouldBeLonger',
      { expiresIn: '1h' },
    );
    res.status(200).json({ token, userId: _id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};