import * as express from "express";
import { credentials as publicCredentials } from "../credentials/public";

/**
 * Compare verification token we got in request with value we have generated for current Slack app.
 */
export function verifyToken(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (req.body.token === publicCredentials.verification_token) {
    next();
  } else {
    res.status(400);
    res.send("Permissions denied. You are unable to use app not via Slack client.");
  }
}
