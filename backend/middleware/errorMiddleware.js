const mongoose = require("mongoose");

// Rejects requests whose :id param is not a valid ObjectId before they hit the DB.
const validateObjectId = (param = "id") => (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[param])) {
    return res.status(404).json({ message: "Resource not found" });
  }
  next();
};

const notFound = (req, res) => {
  res.status(404).json({ message: `Not found - ${req.originalUrl}` });
};

// Last-resort handler for errors passed to next() or thrown in middleware.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Malformed JSON body" });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ message: "Request body too large" });
  }
  if (err.name === "MulterError") {
    return res.status(400).json({ message: err.message });
  }
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ message: err.message });
  }
  if (err instanceof mongoose.Error.CastError) {
    return res.status(404).json({ message: "Resource not found" });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: "A record with that value already exists" });
  }

  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    message: status === 500 ? "Server error" : err.message,
  });
};

module.exports = { validateObjectId, notFound, errorHandler };
