import * as express from "express";
import * as request from "request";
import { SlackGameMajorData } from "../../helpers/slackgamedata";
import { SlackCommandRequestBody } from "../../helpers/slackmessage";
import { setGameData } from "../../middlewares/slackcommands";
import { verifyToken } from "../../middlewares/tokenverification";
import { UIRouter } from "../../uicontrollers/uirouter";

export const router = express.Router();

router.use("/commands", verifyToken);
// todo: type.
router.post("/commands", setGameData, (req: express.Request & {slackData: SlackGameMajorData}, res: express.Response) => {
  const body: SlackCommandRequestBody = req.body;
  const text = body.text;
  if (text === "menu" || !text) {
    res.status(200).send("");
    const uiRouter = new UIRouter(req.slackData.team, req.slackData.channel, req.slackData.player, req.slackData.game, req.slackData.gamer);
    const uiMessagePromise = uiRouter.getUIMessage("/");
    uiMessagePromise.then((uiMessage) => {
      const sendParameters = {
        response_type: "ephemeral",
      };
      uiMessage.setSendParameters(sendParameters);
      request(body.response_url, {
        headers: {
          "Content-type": "application/json",
        },
        json: uiMessage.toJSON(),
        method: "POST",
        uri: body.response_url,
      }, (err) => {
        // TODO: ?
      });
    });
  } else {
    res.status(500).send("Error");
  }
});
