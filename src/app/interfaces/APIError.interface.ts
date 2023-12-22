export interface IAPIError {
  message: string;
  error: string;
  statusCode: number;
}

export class APIError implements IAPIError {
  message: string = "";
  error: string = "";
  statusCode: number = 500;
}
