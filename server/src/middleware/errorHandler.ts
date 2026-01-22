import type { Request, Response, NextFunction } from "express";

const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error:", err.message)
  res.status(500).json({
   error: err.message
  });
}

export default errorHandler;