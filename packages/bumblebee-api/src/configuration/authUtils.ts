import crypto from "crypto";
import HttpStatusCodes from "http-status-codes";
import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";

const algorithm = "aes-192-cbc";

export const encrypt = (str: string) => {
  const password = process.env.API_SECRET;
  const salt = process.env.API_SALT;
  const key = crypto.scryptSync(password, salt, 24);
  const iv = Buffer.alloc(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encryptedId = cipher.update(str, "utf8", "hex");
  encryptedId += cipher.final("hex");

  return encryptedId;
};

export const decrypt = (str: string) => {
  const password = process.env.API_SECRET;
  const salt = process.env.API_SALT;
  const key = crypto.scryptSync(password, salt, 24);
  const iv = Buffer.alloc(16);
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(str, "hex", "utf8");
  decrypted += decipher.final();

  return decrypted;
};

export const generateHash = () => crypto.randomBytes(20).toString("hex");

export const checkAuthentication = (req: Request, res: Response, next: NextFunction) => {
  jwt.verify((req.headers as any)["x-access-token"], process.env.SESSION_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(HttpStatusCodes.UNAUTHORIZED).json({
        code: HttpStatusCodes.UNAUTHORIZED,
        message: "Unauthorized",
      });
    }

    (req as any).userId = decoded.id;

    return next();
  });
};

export const getUserId = (req: Request): string => ((req as any).userId as string);
