import { Request, Response, NextFunction } from "express";
import passport from "passport";

const auth =
  (requiredRole: string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await new Promise<void>((resolve, reject) => {
        passport.authenticate(
          "jwt",
          { session: false },
          verifyCallback(requiredRole, req, resolve, reject)
        )(req, res, next);
      });
      return next();
    } catch (err) {
      return next(err);
    }
  };

const verifyCallback =
  (requiredRole: string, req: Request, resolve: Function, reject: Function) =>
  (err: any, user: any, info: any) => {
    if (err || info) {
      return reject(new Error("Unauthorized"));
    }
    if (requiredRole === "admin" && user.role !== "admin") {
      return reject(new Error("Unauthorized - Insufficient role"));
    }
    req.user = user;
    resolve();
  };

export default auth;
