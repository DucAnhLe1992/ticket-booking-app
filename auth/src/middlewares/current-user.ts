import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayloadI {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayloadI;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayloadI;
    req.currentUser = payload;
  } catch (err) {}

  next();
};
