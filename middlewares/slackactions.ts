import * as express from "express";
import { slackGameData, SlackGameMajorData } from "../helpers/slackgamedata";
import { ParsedSlackActionPayload } from "../helpers/slackmessage";

export function setGameData(req: express.Request & {slackData: SlackGameMajorData & {parsedPayload: ParsedSlackActionPayload}}, res: express.Response, next: express.NextFunction) {
  // Ensure that all needed data exists. Who knows...
  if (req.body.payload) {
    // TODO: any errors must respond to Slack.
    const /** @type ParsedSlackActionPayload */ parsedPayload = JSON.parse(req.body.payload);
    slackGameData(parsedPayload.team.id, parsedPayload.channel.id, parsedPayload.user.id)
      .then((slackGameMajorData) => {
        req.slackData = Object.assign(slackGameMajorData, { parsedPayload });
        next();
      }, (error) => {
        res.status(500).send(error.message);
      });
  } else {
    res.status(500).send("Something wrong with Slack data sent with this request.");
  }
}
