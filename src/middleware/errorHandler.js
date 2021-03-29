const statusCodes = require('http-status-codes');

module.exports = (error, request, response, _next) => {
  switch (error.name) {
    case 'AuthenticationError':
      response.sendStatus(statusCodes.UNAUTHORIZED);
      break;
    case 'AuthorizationError':
      response.status(statusCodes.FORBIDDEN).send(error.message);
      break;
    case 'RecordNotFoundError':
      response.sendStatus(statusCodes.NOT_FOUND);
      break;
    case 'ValidationError':
      response.sendStatus(statusCodes.BAD_REQUEST);
      break;
    default:
      response.sendStatus(statusCodes.INTERNAL_SERVER_ERROR);
      break;
  }
};
