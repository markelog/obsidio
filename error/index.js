module.exports = class CLIError extends Error {
  constructor(params) {
    super();

    // Maintains proper stack trace for
    // where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CLIError);
    }

    this.message = params.message;
    this.exitCode = params.exitCode;
  }
}
