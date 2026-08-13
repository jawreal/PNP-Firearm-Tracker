import type { Request, Response } from "express";

// For automated wake up
const healthCheck = (_: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
};

export default healthCheck;