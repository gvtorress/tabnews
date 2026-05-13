import { InternalServerError, MethodNotAllowedError, NotFoundError, ValidationError } from "./erros";

export function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();
  return response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

export function onErrorHandler(err, request, response) {
  if (err instanceof ValidationError || err instanceof NotFoundError) {
    return response.status(err.statusCode).json(err);
  }
  
  const publicErrorObject = new InternalServerError({
    statusCode: err.statusCode,
    cause: err,
  });

  console.error(publicErrorObject);

  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
