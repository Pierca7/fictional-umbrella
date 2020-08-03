/* eslint-disable no-console */
import { Router, Response, Request } from "express";
import { check, validationResult } from "express-validator/check";
import { Providers, PlaylistDTO } from "../data-objects/playlist";
import HttpStatusCodes from "http-status-codes";
import PlaylistManager from "../data-access/playlists";
import { getUserId } from "configuration/authUtils";

const providers = Object.values(Providers);
// eslint-disable-next-line new-cap
const router: Router = Router();

/**
 * Add a playlist
 */
router.post(
  "/",
  [
    check("url", "The URL of the playlist is required").not().isEmpty(),
    check("url", "Invalid url. Please check the format of your input").isURL(),
    check("provider", "The provider of playlist is required").not().isEmpty(),
    check("provider", `Invalid value. The allowed values are: ${providers.join(", ")}.`).isIn(providers),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: errors.array() });

      return;
    }

    try {
      const playlistDto = await PlaylistDTO.createFromSpotify(req.body.url, String(Math.random()), req.body.name);

      const playlist = await PlaylistManager.create(playlistDto, getUserId(req));

      res.json(playlist);
    } catch (err) {
      console.error(err);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Internal Server Error");
      return;
    }
  },
);

/**
 * Get all playlists for a user
 */
router.get(
  "/",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const playlists = await PlaylistManager.getAll(getUserId(req));

      res.json(playlists);
    } catch (err) {
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Internal Server Error");
    }
  },
);

/**
 * Get a playlists by id
 */
router.get(
  "/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const playlistId = ((req || {}).params || {}).id;

      if (!playlistId) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({ msg: "Your ID is invalid." });

        return;
      }

      const playlist = await PlaylistManager.getById(playlistId, getUserId(req));

      if (!playlist) {
        res.status(HttpStatusCodes.NOT_FOUND).json({ msg: "Playlist not found" });

        return;
      }

      res.json(playlist);
    } catch (err) {
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Internal Server Error");
    }
  },
);

/**
 * Delete playlist by id
 */
router.delete(
  "/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const playlistId = ((req || {}).params || {}).id;

      if (!playlistId) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({ msg: "Your ID is invalid." });

        return;
      }

      await PlaylistManager.deleteById(playlistId, getUserId(req));

      res.status(HttpStatusCodes.NO_CONTENT).json({ msg: "Playlist removed" });
    } catch (err) {
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Internal Server Error");
    }
  }
);

export default router;
