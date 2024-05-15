module.exports = {
  sendJsonResponse: function (errorCode, message) {
    return JSON.stringify({
      errorCode: errorCode,
      message: message,
    });
  },
};
