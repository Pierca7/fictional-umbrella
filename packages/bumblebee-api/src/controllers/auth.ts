/* eslint-disable no-console */
import { Router, Request, NextFunction, Response } from "express";
import HttpStatusCodes from "http-status-codes";
import { decrypt, encrypt, generateHash } from "../configuration/authUtils";
import { param, body, validationResult } from "express-validator/check";
import passport from "passport";

const users = new Map();

// eslint-disable-next-line new-cap
const router: Router = Router();

// const paramChecks = [
//   param("guildId", "The guild ID is required").not().isEmpty(),
//   param("guildId", "The guild ID needs to be a string").isString(),
//   param("userId", "The user ID is required").not().isEmpty(),
//   param("userId", "The user ID needs to be a string").isString(),
// ];

// const bodyChecks = [
//   body("guildId", "The guild ID is required").not().isEmpty(),
//   body("guildId", "The guild ID needs to be a string").isString(),
//   body("userId", "The user ID is required").not().isEmpty(),
//   body("userId", "The user ID needs to be a string").isString(),
// ];

// const validate = (req: Request, res: Response, next: NextFunction) => {
//   const { guildId, userId } = req.params;

//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: errors.array() });

//     next();
//   }

//   try {
//     Object.assign(req, {
//       guildId: decrypt(guildId),
//     });
//     Object.assign(req, {
//       userId: decrypt(userId),
//     });

//     next();
//   } catch (err) {
//     console.error(err);
//     res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
//       error: "Invalid URL",
//     });
//   }
// };

// router.get("/:guildId/:userId", paramChecks, validate, (req: Request, res: Response) => {
//   const { guildId, userId } = req as any;
//   const unique: string = guildId + userId;

//   let token: string;

//   if (users.has(unique)) {
//     token = users.get(unique);
//   } else {
//     token = generateHash();
//     users.set(unique, token);
//   }

//   res.status(HttpStatusCodes.OK).json({
//     token: token,
//   });
// });

// router.post("/", bodyChecks, (req: Request, res: Response, next: NextFunction) => {
//   const { guildId, userId } = req.body;
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: errors.array() });

//     next();
//   }
//   res.json({
//     url: `http://localhost:5000/auth/${encrypt(guildId)}/${encrypt(userId)}`,
//   });
// });

router.get("/login", passport.authenticate("discord"));

router.get("/discord/redirect", passport.authenticate("discord", { failureRedirect: "http://localhost:3000/" }), (req: Request, res: Response) => {
  res.redirect("http://localhost:3000/dashboard");
});

export default router;
