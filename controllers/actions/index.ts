import * as express from "express";
import { CoreOptions } from "request";
import * as request from "request";
import { SlackGameMajorData } from "../../helpers/slackgamedata";
import { ParsedSlackActionPayload } from "../../helpers/slackmessage";
import * as slackActions from "../../middlewares/slackactions";
import { UIRouter } from "../../uicontrollers/uirouter";

export const router = express.Router();

router.post("/actions", slackActions.setGameData, (req: express.Request & {slackData: SlackGameMajorData & {parsedPayload: ParsedSlackActionPayload}}, res: express.Response) => {
  res.status(200).send("");
  const uiRouter = new UIRouter(req.slackData.team, req.slackData.channel, req.slackData.player, req.slackData.game, req.slackData.gamer);
  const uiMessagePromise = uiRouter.getUIMessage(req.slackData.parsedPayload.callback_id, req.slackData.parsedPayload);
  uiMessagePromise.then((uiMessage) => {
    const sendParameters = {
      response_type: "ephemeral",
    };
    uiMessage.setSendParameters(sendParameters);
    const coreOptions: CoreOptions = {
      headers: {
        "Content-type": "application/json",
      },
      json: uiMessage.toJSON(),
      method: "POST",
    };
    request(req.slackData.parsedPayload.response_url, coreOptions, () => {
      // I'm actually not sure we need to do anything.
    });
  }, (err) => {
    // TODO: I don't think we ever reject promise from getUIMessage().
  });
});
