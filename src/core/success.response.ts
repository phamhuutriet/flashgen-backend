import { Response } from "express";

enum StatusCode {
  OK = 200,
  CREATED = 201,
}

enum StatusCodeReason {
  OK = "Success",
  CREATED = "Created",
}

type SuccessResponseProps = {
  message: string;
  status?: StatusCode;
  reason?: StatusCodeReason;
  metadata: Object;
};

class SuccessResponse {
  message: string;
  status: StatusCode;
  reason: StatusCodeReason;
  metadata: Object;

  constructor({
    message,
    status = StatusCode.OK,
    reason = StatusCodeReason.OK,
    metadata = {},
  }: SuccessResponseProps) {
    this.message = message;
    this.status = status;
    this.reason = reason;
    this.metadata = metadata;
  }

  send(res: Response, header = {}) {
    return res.status(this.status).json(this);
  }
}

export class OKResponse extends SuccessResponse {
  constructor({ message, metadata }: SuccessResponseProps) {
    super({ message, metadata });
  }
}

export class CreatedResponse extends SuccessResponse {
  constructor({
    message,
    status = StatusCode.CREATED,
    reason = StatusCodeReason.OK,
    metadata,
  }: SuccessResponseProps) {
    super({ message, status, reason, metadata });
  }
}
