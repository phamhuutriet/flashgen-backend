enum ErrorStatusCode {
  FORBIDEN = 404,
  CONFLICT = 409,
}

enum ErrorMessage {
  FORBIDEN = "Bad request",
  CONFLICT = "Request denied",
}

export class ErrorResponse extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export class ConflictErrorResponse extends ErrorResponse {
  constructor(
    message: string = ErrorMessage.CONFLICT,
    status: number = ErrorStatusCode.CONFLICT
  ) {
    super(message, status);
  }
}

export class BadRequestErrorResponse extends ErrorResponse {
  constructor(
    message: string = ErrorMessage.FORBIDEN,
    status: number = ErrorStatusCode.FORBIDEN
  ) {
    super(message, status);
  }
}
