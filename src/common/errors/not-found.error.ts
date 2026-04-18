import HttpError from "./http.error";

export default class NotFoundError extends HttpError {
  constructor(message: string = "Not Found") {
    super(404, message);
  }
}
