const User = require('../models/user');

exports.getUserStatus = async (req, res, next) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Could not find a user' });
    }
    res.status(200).json({ status: user.status });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateUserStatus = async (req, res, next) => {
  try {
    const { userId } = req;
    const { status } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Could not find a user' });
    }
    user.status = status;
    await user.save();
    res.status(200).json({
      message: 'User status updated successfully',
      status,
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};