module.exports = (error, request, response, next) => {
  switch (error.name) {
    case 'AuthenticationError':
      response.sendStatus(401);
      break;
    case 'AuthorizationError':
      response.status(403).send(error.message);
      break;
    case 'RecordNotFoundError':
      response.sendStatus(404);
      break;
    case 'ValidationError':
      response.sendStatus(400);
      break;
    default:
      response.sendStatus(500);
      break;
  }
};
