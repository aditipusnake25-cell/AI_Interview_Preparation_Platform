const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack || err.message);

  const statusCode =
    res.statusCode && res.statusCode >= 400 ? res.statusCode : 500;

  res.status(statusCode).json({
    message:
      statusCode === 500
        ? "Internal server error"
        : err.message || "Something went wrong"
  });
};

export default errorMiddleware;