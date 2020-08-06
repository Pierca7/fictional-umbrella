import { Router, Request, Response } from "express";
import HttpStatusCodes from "http-status-codes";
import { getUserId } from "configuration/authUtils";
import UserManager from "../data-access/users";

// eslint-disable-next-line new-cap
const router: Router = Router();

router.get("/me", async (req: Request, res: Response) => {
  const userDocument = await UserManager.getUser(getUserId(req));
  const user = UserManager.mapDocumentToUser(userDocument);

  res.status(HttpStatusCodes.OK).json(user);
});

export default router;
