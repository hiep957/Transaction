const { StatusCodes } = require('http-status-codes')  

// Middleware xử lý lỗi tập trung trong ứng dụng Back-end NodeJS (ExpressJS)

function errorHandlingMiddleware (err, req, res, next)  {

  // Mặc định là 500 nếu không có statusCode
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

  // Tạo ra một biến responseError để kiểm soát những gì muốn trả về
  const responseError= {
    statusCode: err.statusCode,
    message: err.message || StatusCodes[err.statusCode], // Nếu lỗi mà không có message thì lấy ReasonPhrases chuẩn theo mã Status Code
    stack: err.stack
  }
  console.log("đã vào đây để bắt lỗi")
  console.error(responseError)
  
  

  // Trả responseError về phía Front-end
  res.status(responseError.statusCode).json(responseError)
}

module.exports = errorHandlingMiddleware

