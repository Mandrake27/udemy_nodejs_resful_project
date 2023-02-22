const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    decodedToken = jwt.verify(token, 'thisSecretShouldBeLonger');
    if (!decodedToken) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
};