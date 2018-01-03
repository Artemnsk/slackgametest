import express = require("express");
import { slackGameData, SlackGameMajorData } from "../helpers/slackgamedata";
import { SlackCommandRequestBody } from "../helpers/slackmessage";

export function setGameData(req: express.Request & {slackData: SlackGameMajorData}, res: express.Response, next: express.NextFunction) {
  const body: SlackCommandRequestBody = req.body;
  // Ensure that all needed data exists. Who knows...
  if (body.team_id && body.channel_id && body.user_id) {
    // TODO: any errors must respond to Slack.
    slackGameData(body.team_id, body.channel_id, body.user_id)
      .then((slackGameMajorData) => {
        req.slackData = slackGameMajorData;
        next();
      }, (error) => {
        res.status(500).send(error.message);
      });
  } else {
    res.status(500).send("Something wrong with Slack data sent with this request.");
  }
}
