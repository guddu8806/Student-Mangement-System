class AppError extends Error {
    constructor(message, statusCode, errors = null) {
        let msg = message;
        let errs = errors;

        if (typeof message === 'object' && message !== null) {
            errs = message;
            msg = Object.values(message).join(', ') || 'Validation error';
        }

        super(msg);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        this.errors = errs;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
