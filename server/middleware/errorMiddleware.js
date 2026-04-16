const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Request failed.";

  if (err.name === "MulterError") {
    statusCode = 400;
    message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Marksheet file must be 5 MB or smaller."
        : "Unable to process the uploaded file.";
  }

  if (statusCode === 500) {
    message = "An unexpected error occurred.";
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  const response = {
    message
  };

  if (err.details) {
    response.errors = err.details;
  }

  res.status(statusCode).json(response);
};

module.exports = errorMiddleware;
