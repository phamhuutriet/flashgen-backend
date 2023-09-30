import * as ReasonPhrases from "../services/utils/reasonPhrases";
import * as StatusCodes from "../services/utils/statusCodes";

export class ErrorResponse extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export class ConflictErrorResponse extends ErrorResponse {
  constructor(
    message: string = ReasonPhrases.CONFLICT,
    status: number = StatusCodes.CONFLICT
  ) {
    super(message, status);
  }
}

export class BadRequestErrorResponse extends ErrorResponse {
  constructor(
    message: string = ReasonPhrases.FORBIDDEN,
    status: number = StatusCodes.FORBIDDEN
  ) {
    super(message, status);
  }
}

export class AuthFailureErrorResponse extends ErrorResponse {
  constructor(
    message: string = ReasonPhrases.UNAUTHORIZED,
    status: number = StatusCodes.UNAUTHORIZED
  ) {
    super(message, status);
  }
}

export class NotFoundErrorResponse extends ErrorResponse {
  constructor(
    message: string = ReasonPhrases.NOT_FOUND,
    status: number = StatusCodes.NOT_FOUND
  ) {
    super(message, status);
  }
}

export class ForbiddenErrorResponse extends ErrorResponse {
  constructor(
    message: string = ReasonPhrases.FORBIDDEN,
    status: number = StatusCodes.FORBIDDEN
  ) {
    super(message, status);
  }
}
