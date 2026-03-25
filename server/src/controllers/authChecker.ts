import type { Request, Response } from "express";

const AuthSender = (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    const { fullName, emailAddress, role, status, _id, createdAt } = req?.user;
    return res.status(200).json({
      user: {
        fullName,
        emailAddress,
        role,
        status,
        _id,
        createdAt,
      },
    });
  }
  return res.status(200).json({ user: null });
};

export default AuthSender;
