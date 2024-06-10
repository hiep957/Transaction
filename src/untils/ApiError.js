
class ApiError extends Error {
    // Declare the statusCode property

    constructor(statusCode, message) {
      super(message)
  
      this.name = 'ApiError'
      this.statusCode = statusCode
  
      Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = ApiError;