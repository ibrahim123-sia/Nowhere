// Error with an HTTP status. Services throw these; routes pass them to the
// error handler and the assistant turns them into tool error messages.
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

module.exports = HttpError;
