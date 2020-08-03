import { Router, Request, Response } from "express";
import HttpStatusCodes from "http-status-codes";
import { User } from "../schemas/User";

// eslint-disable-next-line new-cap
const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
  const user = await User.findById((req as any).userId);

  res.status(HttpStatusCodes.OK).json(user);
});

export default router;
