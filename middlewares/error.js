const errorHandler = (err, req, res) => {
  const { statusCode, message, data } = err;
  res.status(statusCode || 500).json({ message, data });
};

module.exports = errorHandler;