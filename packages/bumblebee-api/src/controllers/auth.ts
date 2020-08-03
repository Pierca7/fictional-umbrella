/* eslint-disable no-console */
import { Router, Request, Response } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { SESSION_DURATION } from "configuration/constants";

// eslint-disable-next-line new-cap
const router: Router = Router();

router.get("/login", passport.authenticate("discord"), (req: Request, res: Response) => { });

router.get("/discord/redirect", passport.authenticate("discord", { failureRedirect: "http://localhost:3000/" }), (req: Request, res: Response) => {
  // Set the JWT token for this session
  const token = jwt.sign(
    { id: (req.user as any)._id },
    process.env.SESSION_SECRET,
    { expiresIn: SESSION_DURATION },
  );

  const currentDate = new Date();
  const expirationTime = currentDate.setMilliseconds(currentDate.getMilliseconds() + SESSION_DURATION);

  return res.redirect(`http://localhost:3000/dashboard?x-access-token=${encodeURI(token)}&x-access-token-expiration=${encodeURI(String(expirationTime))}`);
});

export default router;
