import { Router, Request, Response } from "express";
import HttpStatusCodes from "http-status-codes";

// eslint-disable-next-line new-cap
const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(HttpStatusCodes.UNAUTHORIZED).json({
      code: HttpStatusCodes.UNAUTHORIZED,
      message: "Unauthorized",
    });
  }
});

export default router;
